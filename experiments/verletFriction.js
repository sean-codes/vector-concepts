var scene = new Scene()
var settings = new Settings()
settings.add({ name: 'gravity', min: -1, max: 1, value: 0.05 })
settings.add({ name: 'friction', min: 0.9, max: 1, value: 0.99 })
var boxes = [
   new Box(scene.center(), 50),
   new Box(scene.center().add(new Vector(75, 0)), 50)
]
scene.step = function() {
   for(var box0 in boxes) {
      boxes[box0].draw()
      boxes[box0].move()

      for(var box1 in boxes) {
         if(box0 != box1) SAT(boxes[box0], boxes[box1])
      }
   }

   if(scene.mouse.up){
      boxes.push(new Box(scene.mouse.pos, 25))
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
      var velocity = this.velocity().add(new Vector(0, settings.read('gravity'))).scale(settings.read('friction'))
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
      }
   }

   this.velocity = function() {
      return this.pos.clone().min(this.old)
   }
}


function SAT(box0, box1) {
   // Gather this Data
   var data = { point: undefined, side: undefined, depth: 99999 }

   // Loop each side
   var sides = box0.sides.concat(box1.sides)
   for(var side of sides) {
      var axis = side.points[0].pos.clone().min(side.points[1].pos).normal()

      var box0min =  99999, box0max = -99999
      for(var point of box0.points) {
         var dot = axis.dot(point.pos)
         box0min = Math.min(dot, box0min)
         box0max = Math.max(dot, box0max)
      }

      var box1min =  99999, box1max = -99999
      for(var point of box1.points) {
         var dot = axis.dot(point.pos)
         box1min = Math.min(dot, box1min)
         box1max = Math.max(dot, box1max)
      }

      // How do I know what side they are on?
      var depth = box0min < box1min ? box0max - box1min : box1max - box0min
      if(depth < 0) return // Lets get out of here!

      // I'm taking you with me
      if(depth < data.depth) {
         data.depth = depth
         data.side = side
         data.axis = axis
      }
   }
   // This is where the monster lives
   // Not turning back now

   // Make sure the axis is on the right box
   if(data.side.box == box0) { box0 = box1; box1 = data.side.box }

   // First off make sure we are pointing correctly
   if(data.axis.dot(box0.center().min(box1.center())) < 0) data.axis.scale(-1)

   // Find closest point!
   var minDistance = 99999
   for(var point of box0.points) {
      var distance = distanceSideFromPoint(data.side, point)

      if(distance < minDistance) {
         minDistance = distance
         data.point = point
      }
   }


   // We've collected all the mysteries now we combine
   scene.debugCircle(data.point.pos, 4, '#F22')
   scene.debugLine(data.side.points[0].pos, data.side.points[1].pos, '#F22')
   data.point.pos.add(data.axis.scale(data.depth))

   // How much tilt
   var tilt = data.side.points[0].pos.distance(data.point.pos) / data.side.length
   data.side.points[0].pos.min(data.axis.clone().scale(1-tilt))
   data.side.points[1].pos.min(data.axis.clone().scale(tilt))
}

function distanceSideFromPoint(side, point) {
   var dir = side.points[1].pos.clone().min(side.points[0].pos).unit()
   var dirFromPoint = point.pos.clone().min(side.points[0].pos)
   var ratio = dir.dot(dirFromPoint)
   var pos = side.points[0].pos.clone().add(dir.scale(ratio))
   return point.pos.distance(pos)
}
