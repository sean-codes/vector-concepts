var scene = new Scene()
var settings = new Settings()
settings.add({ name: 'grav', min: -1, max: 1, value: 0.05 })
settings.add({ name: 'friction', min: 0.9, max: 1, value: 0.999 })
var boxes = [
   //new Box(scene.center(), 50),
   //new Box(scene.center().add(new Vector(50, 0)), 50)
]

var drag = { point: undefined, distance: 40 }
scene.step = function() {
   for(var box0 in boxes) {
      boxes[box0].draw()
      boxes[box0].move()
      var i = 1; while(i--) {
         for(var box1 in boxes) {
            if(box0 != box1) SAT(boxes[box0], boxes[box1])
         }
      }

      // Find if mouse near point
      if(scene.mouse.down && !drag.point) {
         for(var point of boxes[box0].points) {
            var distance = point.pos.distance(scene.mouse.pos)
            if(distance < drag.distance) {
               drag.distance = distance
               drag.point = point.pos
            }
         }
      }
   }

   if(drag.point){
      if(!scene.mouse.down) {
         drag = { point: undefined, distance: 40 }
      }
      if(scene.mouse.down) {
         drag.point.add(scene.mouse.pos.clone().min(drag.point).scale(0.5))
      }
      scene.debugCircle(drag.point, 5, '#F22')
   } else if(!drag.point && scene.mouse.up){
      boxes.push(new Box(scene.mouse.pos, 40))
   }
}

function Box(center, size) {
   var center = center.clone()
   this.points = [
      new Point(center.min(new Vector(size/2, size/2))),
      new Point(center.add(new Vector(size, 0))),
      new Point(center.add(new Vector(0, size))),
      new Point(center.min(new Vector(size, 0)))
   ]


   this.sides = [
      new Link(this, this.points[0], this.points[1]),
      new Link(this, this.points[1], this.points[2]),
      new Link(this, this.points[2], this.points[3]),
      new Link(this, this.points[3], this.points[0]),
   ]

   this.braces = [
      new Link(this, this.points[3], this.points[1]),
      new Link(this, this.points[2], this.points[0]),
   ]

   this.move = function() {
      for(var point of this.points) point.move()
      for(var brace of this.braces) brace.tighten()
      for(var side of this.sides) side.tighten()
   }

   this.draw = function() {
      scene.ctx.beginPath()
      scene.ctx.moveTo(this.points[0].pos.x, this.points[0].pos.y)
      for(var point of this.points) {
         scene.ctx.lineTo(point.pos.x, point.pos.y)
      }
      scene.ctx.fillStyle = '#A8B'
      scene.ctx.fill()
      for(var side of this.sides) side.draw()
   }

   this.center = function() {
      return this.points.reduce(function(sum, num){
         return sum.add(num.pos)
      }, new Vector(0, 0)).scale(1/this.points.length)
   }
}

function Link(box, point0, point1) {
   this.box = box
   this.points = [point0, point1]
   this.length = point0.pos.distance(point1.pos)

   this.tighten = function() {
      var distance = this.points[0].pos.distance(this.points[1].pos)
      var dir = this.points[0].pos.clone().min(this.points[1].pos).unit()
      var pull = this.length - distance

      this.points[0].pos.add(dir.clone().scale(pull/2))
      this.points[1].pos.min(dir.clone().scale(pull/2))
   }

   this.move = function() {
      for(var point of this.points) point.move()
      this.tighten()
   }

   this.draw = function() {
      scene.debugLine(this.points[0].pos, this.points[1].pos)
      for(var point of this.points) point.draw()
   }
}

function Point(pos) {
   this.pos = pos.clone()
   this.old = pos.clone()//.add(new Vector(Math.random()*10-5, Math.random()*5-2.587654321))

   this.draw = function() {
      scene.debugCircle(this.pos, 3, '#FFF')
   }

   this.move = function() {
      var velocity = this.velocity().add(new Vector(0, settings.read('grav'))).scale(settings.read('friction'))
      this.old = this.pos.clone()
      this.pos.add(velocity)

      this.contain()
   }

   this.contain = function() {
      var velocity = this.velocity()
      if(this.pos.x < 0 || this.pos.x > scene.width) {
         this.pos.x = this.pos.x < 0 ? 0 : scene.width
         this.old.x = this.pos.x + velocity.x

      }

      if(this.pos.y < 0 || this.pos.y > scene.height) {
         this.pos.y = this.pos.y < 0 ? 0 : scene.height
         this.old.y = this.pos.y + velocity.y
         var totalX = this.pos.x - this.old.x
         this.old.add(new Vector(totalX * 0.1, 0))
      }
   }

   this.velocity = function() {
      return this.pos.clone().min(this.old)
   }
}


function SAT(box0, box1) {
   var data = { vertex: undefined, axis: undefined, side: undefined, depth: 9999, push: undefined }

   var sides = box0.sides.concat(box1.sides)
   for(var side of sides) {
      var axis = side.points[0].pos.normal(side.points[1].pos)

      var box0min =  9999
      var box0max = -9999
      for(var point of box0.points) {
         var depth = axis.dot(point.pos)
         if(depth < box0min) box0min = depth
         if(depth > box0max) box0max = depth
      }

      var box1min =  9999
      var box1max = -9999
      for(var point of box1.points) {
         var depth = axis.dot(point.pos)
         if(depth < box1min) box1min = depth
         if(depth > box1max) box1max = depth
      }

      var depth = box0min < box1min ? box0max - box1min : box1max - box0min
      if(depth < 0) return

      if(depth < data.depth) {
         data.side = side
         data.axis = axis
         data.depth = depth
      }
   }

   // Flip and ship
   if(data.side.box == box0){ box0 = box1; box1 = data.side.box }
   if(data.axis.dot(box0.center().min(box1.center())) < 0) { data.axis.scale(-1) }

   var minDistance = 9999
   for(var point of box0.points) {
      var distance = distanceSideFromPoint(data.side, point)
      if(distance < minDistance) {
         minDistance = distance
         data.vertex = point
      }
   }

   // Collision - Info
   data.push = data.axis.clone().scale(data.depth)
   data.tilt = data.side.points[0].pos.distance(data.vertex.pos) / data.side.length

   // Collision - Apply
   data.vertex.pos.add(data.push)
   data.side.points[0].pos.min(data.push.clone().scale(1-data.tilt))
   data.side.points[1].pos.min(data.push.clone().scale(data.tilt))

   // Friction - Info
   var lineVel = data.side.points[0].velocity().add(data.side.points[1].velocity()).scale(0.5)
   data.relativeVel = lineVel.min(data.vertex.velocity())

   var frictionDirection = data.axis.cross()
   var frictionAmount = frictionDirection.dot(data.relativeVel)
   data.friction = frictionDirection.scale(frictionAmount).scale(0.5)

   // Friction - Apply
   data.vertex.old.min(data.friction)
   data.side.points[0].old.add(data.friction.clone().scale(data.tilt-1))
   data.side.points[1].old.add(data.friction.clone().scale(data.tilt))
}

function distanceSideFromPoint(side, point) {
   var dir = side.points[1].pos.clone().min(side.points[0].pos)
   var dirFromPoint = point.pos.clone().min(side.points[0].pos)
   var ratio = dir.dot(dirFromPoint) / side.length / side.length
   ratio = Math.max(ratio, 0)
   ratio = Math.min(ratio, 1)
   var pos = side.points[0].pos.clone().add(dir.scale(ratio))
   return point.pos.distance(pos)
}
