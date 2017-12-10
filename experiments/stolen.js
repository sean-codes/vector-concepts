
var scene = new Scene()
scene.setSpeed(30);

//----------------------------------------------------------------------------//
// Step
//----------------------------------------------------------------------------//
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
	// SAT collisions and relaxation
	for (let n = 0, m = world.setup.numIterations; n < m; ++n) {
		for (let body of world.bodies) {
			for (let link of body.links) {
				link.solve();
			}
		}
		for(var box1 of world.bodies) {
			for( var box2 of world.bodies ) {
				if (box1 != box2) {
					separatingAxis(box1, box2)
				}
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

//----------------------------------------------------------------------------//
// World
//----------------------------------------------------------------------------//
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
		const body = new Body(
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
}

//----------------------------------------------------------------------------//
// Vector Class
//----------------------------------------------------------------------------//
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
		const nx = p1.y - p0.y;// I reveresed this and removed the negative part in the sat
		const ny = p0.x - p1.x;
		const len = 1.0 / Math.sqrt(nx * nx + ny * ny);
		this.x = nx * len;
		this.y = ny * len;
		return this;
	}
	lineDistance(p0, p1) {
		return this.x * (p0.x - p1.x) + this.y * (p0.y - p1.y);
	}
};


//----------------------------------------------------------------------------//
// Body Class
//----------------------------------------------------------------------------//
function Body(world, points, links, mass, gravity) {
	this.points = [];
	this.edges = [];
	this.links = [];
	this.width = Math.abs(points[0][0] - points[1][0])
	this.height = Math.abs(points[0][1] - points[2][1])
	this.mass = mass;
	this.center = new World.Vec();
	this.half = new World.Vec();
	this.texture = null;
	// vertices
	for (let p of points) {
		const point = new Point(p[0], p[1], gravity);
		this.points.push(point);
	}
	// constraints
	for (let l of links) {
		const link = new Link(this, this.points[l[0]], this.points[l[1]]);
		this.links.push(link);
		if (l[2]) this.edges.push(link);
	}

	// update AABB bounding box
	this.boundingBox = function() {
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
	this.draw = function() {
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

//----------------------------------------------------------------------------//
// Link Class (Sticks)
//----------------------------------------------------------------------------//
function Link(body, p0, p1) {
	this.p0 = p0;
	this.p1 = p1;
	this.body = body;
	this.squareRest = p0.squareDist(p1);
	this.axis = new World.Vec();

	// solve constraint
	this.solve = function() {
		const dx = this.p1.x - this.p0.x;
		const dy = this.p1.y - this.p0.y;
		const delta = this.squareRest / (dx * dx + dy * dy + this.squareRest) - 0.5;
		this.p1.x += dx * delta;
		this.p1.y += dy * delta;
		this.p0.x -= dx * delta;
		this.p0.y -= dy * delta;
	}
}

//----------------------------------------------------------------------------//
// Points
//----------------------------------------------------------------------------//
function Point(x, y, gravity) {
	this.x = x;
	this.y = y;
	this.px = x;
	this.py = y;
	this.gravity = gravity;

	this.squareDist = function(v) {
		const dx = this.x - v.x;
		const dy = this.y - v.y;
		return dx * dx + dy * dy;
	}
	this.integrate = function() {
		const x = this.x;
		const y = this.y;
		this.x += this.x - this.px;
		this.y += this.y - this.py + this.gravity;
		this.px = x;
		this.py = y;
	}
};

 //----------------------------------------------------------------------------//
 // Startup
 //----------------------------------------------------------------------------//
let world = new World({
	gravity: 0.1,
	friction: 0.2,
	numIterations: 1,
	penetrationTreshold: 0.1
});

world.rectangle( scene.width * 0.5, scene.height - 35, Math.max(400, scene.width), 50, 0);

// Utility
function addCrate(x, y) {
	const box = world.rectangle(x, y, 70, 50, 1);
	//box.points[0].py += 10 * (Math.random() - Math.random());
}

function separatingAxis(box1, box2) {
	// Collision Information
	var minEdge, minAxis, minPoint, minOverlap = 999999

	// Loop each Edge
	var edges = box1.edges.concat(box2.edges)
	for(var edge of edges) {

		var axis = edgeNormal(edge.p0, edge.p1)
		//var axis = edge.axis.normal(edge.p0, edge.p1)
		const [min0, max0] = projectAxis(box1, axis)
		const [min1, max1] = projectAxis(box2, axis)

		let dist = min0 < min1 ? min1 - max0 : min0 - max1
		if (dist > 0) return false;
		dist = -dist

		if (dist < minOverlap) {
			minOverlap = dist
			minEdge = edge
			minAxis = axis
		}
	}

	// Swap Box
	if (minEdge.body !== box2) {
		box2 = box1
		box1 = minEdge.body;
	}

	var smallestDist = 999999;
	for (var point of box1.points) {
		var dist = lineDistance(minAxis, point, box2.center)
		if (dist < smallestDist) {
			smallestDist = dist;
			minPoint = point;
		}
	}

	// Magic
	const p0 = minEdge.p0;
	const p1 = minEdge.p1;
	const v0 = minPoint;
	const rx = minAxis.x * minOverlap;
	const ry = minAxis.y * minOverlap;
	// Turnability
	var t = Math.abs(p0.x - p1.x) > Math.abs(p0.y - p1.y)
		? (v0.x - rx - p0.x) / (p1.x - p0.x)
		: (v0.y - ry - p0.y) / (p1.y - p0.y);

	// Mass coefficients
	// Apply Response
	let m0 = box1.mass;
	let m1 = box2.mass;
	// apply collision response
	p0.x -= rx * (1 - t) * m1;
	p0.y -= ry * (1 - t) * m1;
	p1.x -= rx * t * m1;
	p1.y -= ry * t * m1;
	v0.x += rx * m0;
	v0.y += ry * m0;
	// tangent friction
	//THIS IS THE FRICTION / DAMPENING
	// const rvx = v0.x - v0.px - (p0.x + p1.x - p0.px - p1.px) * 0.5;
	// const rvy = v0.y - v0.py - (p0.y + p1.y - p0.py - p1.py) * 0.5;
	// const relTv = -rvx * this.axis.y + rvy * this.axis.x;
	// const rtx = -this.axis.y * relTv;
	// const rty = this.axis.x * relTv;
	// v0.x -= rtx * this.friction * m0;
	// v0.y -= rty * this.friction * m0;
	// p0.x += rtx * (1 - t) * this.friction *  m1;
	// p0.y += rty * (1 - t) * this.friction *  m1;
	// p1.x += rtx * t * this.friction *  m1;
	// p1.y += rty * t * this.friction *  m1;
}

function lineDistance(point, lineP1, lineP2) {
   return point.x * (lineP1.x - lineP2.x) + point.y * (lineP1.y - lineP2.y);
}
function projectAxis(box, axis){
	let max = -99999
   let min = 99999
   for (let point of box.points) {
      const d = axis.dot(point)
      if (d > max) max = d
      if (d < min) min = d
   }
   return [min, max]
}

function edgeNormal(edgeP1, edgeP2){
	const nx = edgeP2.y - edgeP1.y
	const ny = edgeP1.x - edgeP2.x
	const len = 1.0 / Math.sqrt(nx * nx + ny * ny)
	return new World.Vec(nx*len, ny*len)
}
