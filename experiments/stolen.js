var scene = new Scene()

scene.step = function(){
	for (let body of world.bodies) {
		if (body.mass) {
			for (let point of body.points) {
				point.integrate();
			}
		}
	}
	for (let body of world.bodies) {
		body.boundingBox();
	}
	world.broadPhase();
	// SAT collisions and relaxation
	for (let n = 0, m = world.setup.numIterations; n < m; ++n) {
		for (let body of world.bodies) {
			for (let link of body.links) {
				link.solve();
			}
		}
		for (let i = 0; i < world.iContacts; ++i) {
			const contact = world.contacts[i];
			if (contact.sat()) {
				contact.response();
			}
		}
	}
	// draw
	for (let body of world.bodies) {
		body.draw();
	}

	// If fall off edge create a new!
	if (scene.mouse.up) {
		addCrate(scene.mouse.pos.x, scene.mouse.pos.y);
	}
}

//--------------------------------------------------------------------------------------------//
// World
//--------------------------------------------------------------------------------------------//
class World {
	constructor(setup) {
		this.setup = setup;
		this.bodies = [];
		this.contacts = [];
		this.nContacts = 0;
		this.iContacts = 0;
	}

	rectangle(x, y, w, h, m) {
		w = w * 0.5;
		h = h * 0.5;
		const body = new World.Body(
			this,
			[[x - w, y - h], [x + w, y - h], [x + w, y + h], [x - w, y + h]],
			[
				[0, 1, true],
				[1, 2, true],
				[2, 3, true],
				[3, 0, true],
				[0, 2, false],
				[1, 3, false]
			],
			m,
			this.setup.gravity
		);
		body.boundingBox();
		body.color = scene.randomColor()
		this.bodies.push(body);
		return body;
	}

	// test AABB collision
	AABBColide(x, y, w, h) {
		for (let b1 of this.bodies) {
			const dx = Math.abs(b1.center.x - x) - (b1.half.x + w * 0.5);
			const dy = Math.abs(b1.center.y - y) - (b1.half.y + h * 0.5);
			if (dx < 0 && dy < 0) return true;
		}
		return false;
	}

	// AABB broad phase
	broadPhase() {
		this.iContacts = 0;
		for (let i = 0; i < this.bodies.length - 1; ++i) {
			const b0 = this.bodies[i];
			for (let j = i + 1; j < this.bodies.length; ++j) {
				const b1 = this.bodies[j];
				if (b0.mass || b1.mass) {
					const dx = Math.abs(b1.center.x - b0.center.x) - (b1.half.x + b0.half.x);
					const dy = Math.abs(b1.center.y - b0.center.y) - (b1.half.y + b0.half.y);
					if (dx < 0 && dy < 0) {
						// update contacts
						this.iContacts++;
						if (this.iContacts > this.nContacts) {
							this.contacts.push(new World.Contact(this.setup));
							this.nContacts++;
						}
						this.contacts[this.iContacts - 1].set(b0, b1);
					}
				}
			}
		}
	}
}


//--------------------------------------------------------------------------------------------//
// Vector Class
//--------------------------------------------------------------------------------------------//
World.Vec = class Vec {
	constructor(x = 0.0, y = 0.0) {
		this.x = x;
		this.y = y;
	}
	set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}
	copy(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	}
	neg() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}
	dot(v) {
		return this.x * v.x + this.y * v.y;
	}
	normal(p0, p1) {
		const nx = p0.y - p1.y;
		const ny = p1.x - p0.x;
		const len = 1.0 / Math.sqrt(nx * nx + ny * ny);
		this.x = nx * len;
		this.y = ny * len;
		return this;
	}
	lineDistance(p0, p1) {
		return this.x * (p0.x - p1.x) + this.y * (p0.y - p1.y);
	}
};

//--------------------------------------------------------------------------------------------//
// Contact Pair
//--------------------------------------------------------------------------------------------//
World.Contact = class Contact {
	constructor(setup) {
		this.b0 = null;
		this.b1 = null;
		this.edge = null;
		this.vertex = null;
		this.axis = new World.Vec();
		this.depth = 0.0;
		this.penetrationTreshold = setup.penetrationTreshold || 0.1;
		this.friction = setup.friction || 0.0;
	}
	set(b0, b1) {
		this.b0 = b0;
		this.b1 = b1;
	}
	// Separating Axis Theorem collision
	sat() {
		let minDistance = 999999;
		const n0 = this.b0.edges.length;
		const n1 = this.b1.edges.length;
		for (let i = 0, n = n0 + n1; i < n; ++i) {
			const edge = i < n0 ? this.b0.edges[i] : this.b1.edges[i - n0];
			const [min0, max0] = this.b0.projectAxis(edge);
			const [min1, max1] = this.b1.projectAxis(edge);
			let dist = min0 < min1 ? min1 - max0 : min0 - max1;
			if (dist > 0) return false;
			dist = -dist;
			if (dist < minDistance) {
				minDistance = dist;
				this.edge = edge;
			}
		}
		if (minDistance < this.penetrationTreshold) return false;
		this.axis.copy(this.edge.axis);
		this.depth = minDistance;
		if (this.edge.body !== this.b1) {
			const tmp = this.b0;
			this.b0 = this.b1;
			this.b1 = tmp;
		}
		const n = this.axis.lineDistance(this.b0.center, this.b1.center);
		if (n < 0) {
			this.axis.neg();
		}
		let smallestDist = 999999;
		for (let point of this.b0.points) {
			const dist = this.axis.lineDistance(point, this.b1.center);
			if (dist < smallestDist) {
				smallestDist = dist;
				this.vertex = point;

			}
		}
		// return collision
		scene.drawCircle(this.vertex, 5, this.b0.color)
		//scene.stop()
		//console.log(this)
		return true;
	}
	// collision response
	response() {
		// Axis Points
		const p0 = this.edge.p0;
		const p1 = this.edge.p1;
		// Closest point to s2
		const v0 = this.vertex;
		// Scale the axis to the depth(Overlap)
		const ry = this.axis.y * this.depth;
		const rx = this.axis.x * this.depth;
		// this is weird. If the difference between x is greater than y?
		const t = Math.abs(p0.x - p1.x) > Math.abs(p0.y - p1.y)
			? (v0.x - rx - p0.x) / (p1.x - p0.x)
			: (v0.y - ry - p0.y) / (p1.y - p0.y);
		//console.log('T: ' + t)

		// why
		const lambda = 1 / (t * t + (1 - t) * (1 - t));
		//console.log('lambda: ' + lambda)
		// mass coefficients
		let m0 = this.b0.mass;
		let m1 = this.b1.mass;
		const tm = m0 + m1;
		m0 = m0 / tm;
		m1 = m1 / tm;
		// apply collision response
		p0.x -= rx * (1 - t) * lambda * m1;
		p0.y -= ry * (1 - t) * lambda * m1;
		p1.x -= rx * t * lambda * m1;
		p1.y -= ry * t * lambda * m1;
		v0.x += rx * m0;
		v0.y += ry * m0;
		// tangent friction
		// THIS IS WHERE THE MAGIC IS
		const rvx = v0.x - v0.px - (p0.x + p1.x - p0.px - p1.px) * 0.5;
		const rvy = v0.y - v0.py - (p0.y + p1.y - p0.py - p1.py) * 0.5;
		const relTv = -rvx * this.axis.y + rvy * this.axis.x;
		const rtx = -this.axis.y * relTv;
		const rty = this.axis.x * relTv;
		console.log(rtx, rty);
		v0.x -= rtx * this.friction * m0;
		v0.y -= rty * this.friction * m0;
		p0.x += rtx * (1 - t) * this.friction * lambda * m1;
		p0.y += rty * (1 - t) * this.friction * lambda * m1;
		p1.x += rtx * t * this.friction * lambda * m1;
		p1.y += rty * t * this.friction * lambda * m1;
	}
}

//--------------------------------------------------------------------------------------------//
// Body Class
//--------------------------------------------------------------------------------------------//
World.Body = class Body {
	constructor(world, points, links, mass, gravity) {
		this.points = [];
		this.edges = [];
		this.links = [];
		this.width = Math.abs(points[0][0] - points[1][0])
		this.height = Math.abs(points[0][1] - points[2][1])
		console.log(points)
		this.mass = mass;
		this.center = new World.Vec();
		this.half = new World.Vec();
		this.texture = null;
		// vertices
		for (let p of points) {
			const point = new World.Point(p[0], p[1], gravity);
			this.points.push(point);
		}
		// constraints
		for (let l of links) {
			const link = new World.Link(this, this.points[l[0]], this.points[l[1]]);
			this.links.push(link);
			if (l[2]) this.edges.push(link);
		}
	}
	// rotate static body
	rotate(a) {
		for (let p of this.points) {
			p.px = p.x;
			p.py = p.y;
			const dx = p.x - this.center.x;
			const dy = p.y - this.center.y;
			const d = Math.sqrt(dx * dx + dy * dy);
			const ia = Math.atan2(dy, dx);
			p.x = this.center.x + Math.cos(ia + a) * d;
			p.y = this.center.y + Math.sin(ia + a) * d;
		}
	}
	// update AABB bounding box
	boundingBox() {
		let minX = 999999;
		let minY = 999999;
		let maxX = -999999;
		let maxY = -999999;
		for (let point of this.points) {
			if (point.x > maxX) maxX = point.x;
			if (point.x < minX) minX = point.x;
			if (point.y > maxY) maxY = point.y;
			if (point.y < minY) minY = point.y;
		}
		this.center.set((minX + maxX) * 0.5, (minY + maxY) * 0.5);
		this.half.set((maxX - minX) * 0.5, (maxY - minY) * 0.5);
	}
	projectAxis(edge) {
		edge.axis.normal(edge.p0, edge.p1);
		let max = -99999;
		let min = 99999;
		for (let point of this.points) {
			const d = edge.axis.dot(point);
			if (d > max) max = d;
			if (d < min) min = d;
		}
		return [min, max];
	}
	draw() {
		const p = this.points;
		const x = p[0].x;
		const y = p[0].y;
		scene.ctx.save();
		scene.ctx.translate(x, y);
		scene.ctx.rotate(Math.atan2(p[1].y - y, p[1].x - x));
		scene.ctx.strokeStyle = '#000'
		scene.ctx.strokeRect(0, 0, this.width, this.height)
		scene.ctx.restore();
	}
};

//--------------------------------------------------------------------------------------------//
// Points
//--------------------------------------------------------------------------------------------//
World.Point = class Point {
	constructor(x, y, gravity) {
		this.x = x;
		this.y = y;
		this.px = x;
		this.py = y;
		this.gravity = gravity;
	}
	squareDist(v) {
		const dx = this.x - v.x;
		const dy = this.y - v.y;
		return dx * dx + dy * dy;
	}
	integrate() {
		const x = this.x;
		const y = this.y;
		this.x += this.x - this.px;
		this.y += this.y - this.py + this.gravity;
		this.px = x;
		this.py = y;
	}
};
//--------------------------------------------------------------------------------------------//
// Link Class (Sticks)
//--------------------------------------------------------------------------------------------//
World.Link = class Link {
	constructor(body, p0, p1) {
		this.p0 = p0;
		this.p1 = p1;
		this.body = body;
		this.squareRest = p0.squareDist(p1);
		this.axis = new World.Vec();
	}
	// solve constraint
	solve() {
		const dx = this.p1.x - this.p0.x;
		const dy = this.p1.y - this.p0.y;
		const delta = this.squareRest / (dx * dx + dy * dy + this.squareRest) - 0.5;
		this.p1.x += dx * delta;
		this.p1.y += dy * delta;
		this.p0.x -= dx * delta;
		this.p0.y -= dy * delta;
	}
};

 //--------------------------------------------------------------------------------------------//
 // Startup
 //--------------------------------------------------------------------------------------------//
let world = new World({
	gravity: 0.2,
	friction: 0.2,
	numIterations: 5,
	penetrationTreshold: 0.1
});

// ground
world.rectangle( scene.width * 0.5, scene.height + 15, Math.max(400, scene.width), 50, 0);
function addCrate(x, y) {
	var x = x||Math.random()*scene.width
	var y = y||Math.random()*-200
	const box = world.rectangle(x, y, 70, 50, 1);
	// Add some spin
	box.points[0].py += 10 * (Math.random() - Math.random());
}
