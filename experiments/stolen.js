// Verlet physics engine
var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')
var verletEngine = {};

var kGravity = 0.1,
    kNumIterations = 5,
    kFriction = 5,
    kFrictionGround = 0.2,
    kViscosity = 1.0
var bodies = [], vertices = [], constraints = [];

var Vec2 = function(x, y) {
	this.x = x || 0.0;
	this.y = y || 0.0;
};

Vec2.prototype = {
	set: function(x, y) {
		this.x = x;
		this.y = y;
		return this;
	},

	copy: function(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	},

	neg: function() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	},

	sub: function(v0, v1) {
		this.x = v0.x - v1.x;
		this.y = v0.y - v1.y;
		return this;
	},

	scale: function(v, s) {
		this.x = v.x * s;
		this.y = v.y * s;
		return this;
	},

	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},

	squareDist: function(v) {
		var dx = this.x - v.x;
		var dy = this.y - v.y;
		return dx * dx + dy * dy;
	},

	length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	perp: function(v) {
		this.x = -v.y;
		this.y = v.x;
		return this;
	},

	normal: function(v0, v1) {
		// perpendicular
		var nx = v0.y - v1.y, ny = v1.x - v0.x;
		// normalize
		var len = 1.0 / Math.sqrt(nx * nx + ny * ny);
		this.x = nx * len;
		this.y = ny * len;
		return this;
	}
};

// animation loop
var run = function() {
	requestAnimationFrame(run);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	integrate();
	solve();
	draw();
};

// draw bodies loop
var draw = function() {
	for (var i = 0, n = bodies.length; i < n; i++) {
		bodies[i].draw();
	}
};

// Verlet integration loop
var integrate = function() {
	for (var i = 0, n = vertices.length; i < n; i++) {
		vertices[i].integrate();
	}
};

// solve constraints and collisions

var solve = function() {
	var nBodies = bodies.length, nConstraints = constraints.length;

	for (var n = 0; n < kNumIterations; n++) {
		//
		// solve constraints
		//

		for (var i = 0; i < nConstraints; i++) {
			constraints[i].solve();
		}

		//
		// Recalculate the bounding boxes
		//

		for (var i = 0; i < nBodies; i++) {
			bodies[i].boundingBox();
		}

		//
		// collisions detection
		//

		for (var i = 0; i < nBodies - 1; i++) {
			var b0 = bodies[i];

			for (var j = i + 1; j < nBodies; j++) {
				var b1 = bodies[j];
				collision.SAT(b0, b1) && collision.resolve();
			}
		}
	}
};


// constraint constructor
var Constraint = function(parent, v0, v1, edge) {
	this.parent = parent;
	this.v0 = v0;
	this.v1 = v1;
	this.p0 = v0.position;
	this.p1 = v1.position;
	this.dist = this.p0.squareDist(this.p1);
	this.edge = edge;
};

// solve constraint
Constraint.prototype.solve = function() {
	var dx = this.p1.x - this.p0.x;
	var dy = this.p1.y - this.p0.y;

	// using square root approximation

	var delta = this.dist / (dx * dx + dy * dy + this.dist) - 0.5;

	dx *= delta;
	dy *= delta;

	this.p1.x += dx;
	this.p1.y += dy;
	this.p0.x -= dx;
	this.p0.y -= dy;
};

// body constructor

var Body = function(body) {
	//
	// body properties
	//
	this.vCount = 0;
	this.eCount = 0;
	this.vertices = [];
	this.positions = [];
	this.edges = [];
	this.center = new Vec2();
	this.halfEx = new Vec2();
	this.min = 0;
	this.max = 0;
	this.color = body.color || "#fff";
	this.mass = body.mass || 1.0;

	//
	// Node constructor
	//

	var Vertex = function(parent, vertex) {
		this.parent = parent;
		this.position = new Vec2(vertex.x, vertex.y);
		this.oldPosition = new Vec2(vertex.x, vertex.y);
	};

	//
	// verlet integration
	//

	Vertex.prototype.integrate = function() {
		var p = this.position, o = this.oldPosition, x = p.x, y = p.y;

		p.x += kViscosity * p.x - kViscosity * o.x;
		p.y += kViscosity * p.y - kViscosity * o.y + kGravity;

		o.set(x, y);

		//
		// screen limits
		//

		if (p.y < 0) p.y = 0;
		else if (p.y > canvas.height) {
			p.x -= (p.y - canvas.height) * (p.x - o.x) * kFrictionGround;
			p.y = canvas.height;
		}

		if (p.x < 0) p.x = 0;
		else if (p.x > canvas.width) p.x = canvas.width;
	};

	//
	// def vertices
	//

	for (var n in body.vertices) {
		var vertex = new Vertex(this, body.vertices[n]);
		body.vertices[n].ref = vertex;
		this.vertices.push(vertex);
		this.positions.push(vertex.position);
		vertices.push(vertex);
		this.vCount++;
	}

	//
	// def constraints
	//

	for (var i = 0; i < body.constraints.length; i++) {
		var bci = body.constraints[i];

		var constraint = new Constraint(
			this,
			body.vertices[bci[0]].ref,
			body.vertices[bci[1]].ref,
			bci[2] || false
		);

		if (constraint.edge) {
			this.edges.push(constraint);
			this.eCount++;
		}

		constraints.push(constraint);
	}
};

// bounding box
Body.prototype.boundingBox = function() {
	var minX = 99999.0, minY = 99999.0, maxX = -99999.0, maxY = -99999.0;

	for (var i = 0; i < this.vCount; i++) {
		var p = this.positions[i];

		if (p.x > maxX) maxX = p.x;
		if (p.y > maxY) maxY = p.y;
		if (p.x < minX) minX = p.x;
		if (p.y < minY) minY = p.y;
	}

	// center
	this.center.set((minX + maxX) * 0.5, (minY + maxY) * 0.5);

	// half extents
	this.halfEx.set((maxX - minX) * 0.5, (maxY - minY) * 0.5);
};

// Project the vertices onto the axis
Body.prototype.projectAxis = function(axis) {
	var d = this.positions[0].dot(axis);
	this.min = this.max = d;

	for (var i = 1; i < this.vCount; i++) {
		d = this.positions[i].dot(axis);
		if (d > this.max) this.max = d;
		if (d < this.min) this.min = d;
	}
};

// draw body
Body.prototype.draw = function() {
	ctx.beginPath();
	var p = this.edges[0].p0;
	ctx.moveTo(p.x, p.y);

	for (var i = 1; i < this.eCount; i++) {
		p = this.edges[i].p0;
		ctx.lineTo(p.x, p.y);
	}

	ctx.closePath;
	ctx.fillStyle = this.color;
	ctx.fill();

};

// collision object
var collision = {
	testAxis: new Vec2(),
	axis: new Vec2(),
	center: new Vec2(),
	line: new Vec2(),
	response: new Vec2(),
	relVel: new Vec2(),
	tangent: new Vec2(),
	relTanVel: new Vec2(),
	depth: 0,
	edge: null,
	vertex: null,

	//
	// Separating Axis Theorem collision test
	//

	SAT: function(B0, B1) {
		//
		// aabb overlap test
		//

		if (
			!(0 > Math.abs(B1.center.x - B0.center.x) - (B1.halfEx.x + B0.halfEx.x) &&
				0 > Math.abs(B1.center.y - B0.center.y) - (B1.halfEx.y + B0.halfEx.y))
		)
			return false; // no aabb overlap

		//
		// SAT collision detection
		//

		var minDistance = 99999, n0 = B0.eCount, n1 = B1.eCount;

		// Iterate through all of the edges of both bodies
		for (var i = 0, n = n0 + n1; i < n; i++) {
			// get edge
			var edge = i < n0 ? B0.edges[i] : B1.edges[i - n0];

			// Calculate the perpendicular to this edge and normalize it
			this.testAxis.normal(edge.p0, edge.p1);

			// Project both bodies onto the normal
			B0.projectAxis(this.testAxis);
			B1.projectAxis(this.testAxis);

			//Calculate the distance between the two intervals
			var dist = B0.min < B1.min ? B1.min - B0.max : B0.min - B1.max;

			// If the intervals don't overlap, return, since there is no collision
			if (dist > 0) return false;
			else if (Math.abs(dist) < minDistance) {
				minDistance = Math.abs(dist);

				// Save collision information
				this.axis.copy(this.testAxis);
				this.edge = edge;
			}
		}

		this.depth = minDistance;

		// Ensure collision edge in B1 and collision vertex in B0
		if (this.edge.parent != B1) {
			var t = B1;
			B1 = B0;
			B0 = t;
		}

		// Make sure that the collision normal is pointing at B1
		var n = this.center.sub(B0.center, B1.center).dot(this.axis);

		// Revert the collision normal if it points away from B1
		if (n < 0) this.axis.neg();

		var smallestDist = 99999, v, dist;

		for (var i = 0; i < B0.vCount; i++) {
			// Measure the distance of the vertex from the line using the line equation
			v = B0.vertices[i];
			this.line.sub(v.position, B1.center);
			dist = this.axis.dot(this.line);

			// Set the smallest distance and the collision vertex
			if (dist < smallestDist) {
				smallestDist = dist;
				this.vertex = v;
			}
		}

		// There is no separating axis. Report a collision!
		return true;
	},

	//
	// collision resolution
	//

	resolve: function() {
		// cache vertices positions
		var p0 = this.edge.p0,
			p1 = this.edge.p1,
			o0 = this.edge.v0.oldPosition,
			o1 = this.edge.v1.oldPosition,
			vp = this.vertex.position,
			vo = this.vertex.oldPosition,
			rs = this.response;

		// response vector
		this.response.scale(this.axis, this.depth);

		// calculate where on the edge the collision vertex lies
		var t = Math.abs(p0.x - p1.x) > Math.abs(p0.y - p1.y)
			? (vp.x - rs.x - p0.x) / (p1.x - p0.x)
			: (vp.y - rs.y - p0.y) / (p1.y - p0.y);
		var lambda = 1 / (t * t + (1 - t) * (1 - t));

		// mass coefficient
		var m0 = this.vertex.parent.mass,
			m1 = this.edge.parent.mass,
			tm = m0 + m1,
			m0 = m0 / tm,
			m1 = m1 / tm;

		// apply the collision response
		p0.x -= rs.x * (1 - t) * lambda * m0;
		p0.y -= rs.y * (1 - t) * lambda * m0;
		p1.x -= rs.x * t * lambda * m0;
		p1.y -= rs.y * t * lambda * m0;

		vp.x += rs.x * m1;
		vp.y += rs.y * m1;

		//
		// collision friction
		//

		// compute relative velocity
		this.relVel.set(
			vp.x - vo.x - (p0.x + p1.x - o0.x - o1.x) * 0.5,
			vp.y - vo.y - (p0.y + p1.y - o0.y - o1.y) * 0.5
		);

		// axis perpendicular
		this.tangent.perp(this.axis);

		// project the relative velocity onto tangent
		var relTv = this.relVel.dot(this.tangent);
		var rt = this.relTanVel.set(this.tangent.x * relTv, this.tangent.y * relTv);

		// apply tangent friction
		vo.x += rt.x * kFriction * m1;
		vo.y += rt.y * kFriction * m1;

		o0.x -= rt.x * (1 - t) * kFriction * lambda * m0;
		o0.y -= rt.y * (1 - t) * kFriction * lambda * m0;
		o1.x -= rt.x * t * kFriction * lambda * m0;
		o1.y -= rt.y * t * kFriction * lambda * m0;
	}
};

// external API
var createRectangle = function(x, y, w, h, m, c) {
	var b = new Body({
		mass: m,
		color: c,
		vertices: {
			n0: { x: x, y: y },
			n1: { x: x + w, y: y },
			n2: { x: x + w, y: y + h },
			n3: { x: x, y: y + h }
		},
		constraints: [
			["n0", "n1", true],
			["n1", "n2", true],
			["n2", "n3", true],
			["n3", "n0", true],
			["n0", "n2"],
			["n3", "n1"]
		]
	});
	bodies.push(b);
	return b;
};



var createJoint = function(B0, v0, B1, v1) {
	var constraint = new Constraint(
		null,
		B0.vertices[v0],
		B1.vertices[v1],
		false
	);

	constraints.push(constraint);
};


run();


var w = canvas.width / 35;
var h = canvas.height / 2 - 4.5 * w;
createRectangle(50, 50, 50, 50, .1, .1);
