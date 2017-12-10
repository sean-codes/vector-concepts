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
      box1.move()
      box1.draw()
      for(var box2 of boxes) {
         if(box1 != box2) { boxCollisionAndResponse(box1, box2) }
      }
   }

   if(scene.mouse.up) { boxes.push(
      new Box(scene.mouse.pos.x-25, scene.mouse.pos.y-25, 50, 50)
   )}
}

function Box(x, y, width, height) {
   // Create Points
   this.points = [
      new Point(x, y),
      new Point(x+width, y),
      new Point(x+width, y+height),
      new Point(x, y+height)
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

function Point(x, y) {
   this.pos = new Vector(x, y)
   this.old = new Vector(x, y).add(new Vector(10*Math.random()-5, 1))

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
}

function boxCollisionAndResponse(box1, box2) {
   // Separating Axis Theorem
   var edges = box1.edges.concat(box2.edges)
   // Save these for response
   var minOverlap = 99999
   var minEdge = undefined
   var minAxis = undefined
   for(var edge of edges) {
      // Axis Information
      var axis = edge.points[1].pos.clone().min(edge.points[0].pos)
      var axisNorm = axis.normal()

      // Mins / Maxs
      var box1min = 9999
      var box1max = 0
      var box2min = 9999
      var box2max = 0
      for(var point of box1.points) {
         var dot = axisNorm.dot(point.pos)
         box1min = Math.min(box1min, dot)
         box1max = Math.max(box1max, dot)
      }

      for(var point of box2.points) {
         var dot = axisNorm.dot(point.pos)
         box2min = Math.min(box2min, dot)
         box2max = Math.max(box2max, dot)
      }

      if(box1min > box2max || box1max < box2min) return
      var overlap = box1min < box2min ? box2min - box1max : box2max - box1min


      if(Math.abs(overlap) < Math.abs(minOverlap)){
         minOverlap = overlap
         minEdge = edge
         minAxis = axisNorm
      }
   }
   //scene.debug(Math.round(minOverlap) + minAxis.toString())

   // Collision Response
   var closestPoint = undefined
   var closestDistance = 9999
   for(var point of box1.points) {
      scene.debugCircle(box1.center(), 3, '#465')
      var center = box1.center()
      var distance = box2.center().distance(point.pos)// Will break on odd shapes
      if(distance < closestDistance){
         closestDistance = distance
         closestPoint = point
      }
   }

   closestPoint.pos.add(minAxis.scale(minOverlap))
   scene.debugCircle(closestPoint.pos, 4, '#FFF')
}
