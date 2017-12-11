var scene = new Scene()

var gravity = new Vector(0, 0.1)
var bounce = 0.9
var friction = 0.99

var boxes = [
   new Box((scene.width-100)*Math.random()+50, (scene.height-100)*Math.random()+50, 50, 50),
   new Box((scene.width-100)*Math.random()+50, (scene.height-100)*Math.random()+50, 50, 50),
   new Box((scene.width-100)*Math.random()+50, (scene.height-100)*Math.random()+50, 50, 50)
]

scene.step = function() {
   for(var box1 of boxes) {
      box1.draw()
      box1.move()

      for(var box2 of boxes) {
         if(box1 != box2) { boxCollisionAndResponse(box1, box2) }
      }
   }

   if(scene.mouse.up) { boxes.push(
      new Box(scene.mouse.pos.x-25, scene.mouse.pos.y-25, 50, 50, true)
   )}
}

function Box(x, y, width, height, stable) {
   // Create Points
   this.points = [
      new Point(x, y, stable),
      new Point(x+width, y, stable),
      new Point(x+width, y+height, stable),
      new Point(x, y+height, stable)
   ]
   // Create Edges
   this.edges = [
      new Edge(this.points[0], this.points[1], this),
      new Edge(this.points[1], this.points[2], this),
      new Edge(this.points[2], this.points[3], this),
      new Edge(this.points[3], this.points[0], this)
   ]
   // Bar
   this.bars = [
      new Edge(this.points[0], this.points[2], this),
      new Edge(this.points[3], this.points[1], this)
   ]

   this.draw = function() {
      for(var edge of this.edges) {
         edge.draw()
      }
   }

   this.move = function() {
      for(var point of this.points) { point.move() }
      for(var edge of this.edges) { edge.contrain() }
      this.bars[0].contrain()
      this.bars[1].contrain()
   }

   this.center = function() {
      var halfHypnos = this.points[2].pos.clone().min(this.points[0].pos).scale(0.5)
      return this.points[0].pos.clone().add(halfHypnos)
   }
}

function Edge(p1, p2, box) {
   this.box = box
   this.points = [p1, p2]
   this.length = p1.pos.distance(p2.pos)
   this.draw = function() {
      scene.drawLine({v1: p1.pos, v2: p2.pos, color: '#000'})
      p1.draw()
      p2.draw()
   }

   this.contrain = function() {
      var dir = p2.pos.clone().min(p1.pos)
      var distance = dir.length()
      var pull = distance - this.length

      this.points[0].pos.add(dir.unit().scale(pull/2))
      this.points[1].pos.add(dir.unit().scale(-pull/2))
   }
}

function Point(x, y, stable) {
   this.pos = new Vector(x, y)
   this.old = new Vector(x, y)
   if(!stable) this.old.add(new Vector(10*Math.random()-5, 1))

   this.draw = function() {
      scene.drawCircle({ v: this.pos, color: '#000', radius: 3})
   }

   this.move = function() {
      var vel = this.pos.clone().min(this.old).add(gravity).scale(friction)
      this.old = this.pos.clone()
      this.pos.add(vel)

      this.contain()
   }

   this.contain = function() {
      var vel = this.pos.clone().min(this.old)
      if(this.pos.x > scene.width || this.pos.x < 0) {
         this.pos.x = this.pos.x < 0 ? 0 : scene.width
         this.old.x = this.pos.x + vel.x*bounce
      }

      if(this.pos.y > scene.height || this.pos.y < 0) {
         this.pos.y = this.pos.y < 0 ? 0 : scene.height
         this.old.y = this.pos.y + vel.y*bounce
      }
   }

   this.velocity = function() {
      return this.pos.clone().min(this.old).add(gravity).scale(friction)
   }
}

function boxCollisionAndResponse(box1, box2) {
   // Collision Information
   var minEdge, minAxis, minPoint, minOverlap = 999999

   // Loop each Edge
   var edges = box1.edges.concat(box2.edges)
   for(var edge of edges) {
      var axis = edgeNormal(edge.points[0].pos, edge.points[1].pos)
      var [min0, max0] = projectAxis(box1, axis)
      var [min1, max1] = projectAxis(box2, axis)

      var distance = intervalDistance(min0, max0, min1, max1)
      //scene.debug(distance)
      if(distance > 0) return

      if (Math.abs(distance) < Math.abs(minOverlap)) {
         minOverlap = distance
         minEdge = edge
         minAxis = axis
      }
   }

   // Make sure collision edge = box 2
   if(minEdge.box == box1){//If edge is box1
      box1 = box2//Box 1 needs the vertex
      box2 = minEdge.box//box needs the edge
   }

   var n = box1.center().min(box2.center()).dot(minAxis)
   if(n < 0) minAxis.scale(-1)
   //scene.stop()
   // Find the closest point
   var minDistance, vertex
   for(var point of box1.points){
      var distance = point.pos.distance(box2.center())
      if(!minDistance || distance < minDistance) {
         minDistance = distance
         vertex = point.pos
      }
   }


   // Attept to use vector magic
   var minP1 = minEdge.points[0].pos
   var minP2 = minEdge.points[1].pos
   minAxis.scale(-minOverlap)

   var tilt = Math.abs(minP1.x - minP2.x) > Math.abs(minP1.y - minP2.y)
      ? (vertex.x - minAxis.x - minP1.x) / (minP2.x - minP1.x)
      : (vertex.y - minAxis.y - minP1.y) / (minP2.y - minP1.y)

   minP1.min(minAxis.clone().scale(1-tilt))
   minP2.min(minAxis.clone().scale(tilt))
   vertex.add(minAxis)
}

function lineDistance(point, lineP1, lineP2) {
   return point.x * (lineP1.x - lineP2.x) + point.y * (lineP1.y - lineP2.y);
}

function projectAxis(box, axis) {
   let max = -99999
   let min = 99999
   for (let point of box.points) {
      const d = axis.dot(point.pos)
      if (d > max) max = d
      if (d < min) min = d
   }
   return [min, max]
}

function edgeNormal(edgeP1, edgeP2) {
	const nx = edgeP2.y - edgeP1.y
	const ny = edgeP1.x - edgeP2.x
	const len = 1.0 / Math.sqrt(nx * nx + ny * ny)
   return new Vector(nx * len, ny * len)
}

function intervalDistance(minA, maxA, minB, maxB) {
   return minA < minB ? minB - maxA : minA - maxB
}