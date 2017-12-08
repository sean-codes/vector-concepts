var scene = new Scene()
scene.setSpeed(30)
scene.ctx.canvas.style.background = '#111'
// Settings
var set = {
   gravity: new Vector(0, 0.2),
   bounce: 0.9,
   friction: 1
}

// Create objects
var shapes = []
shapes.push(new Block(0, scene.height-50, scene.width, 40))
shapes.push(new Block(scene.width/2, 120, 50, 50, 15))

scene.step = function() {
   scene.clear()
   for(var shape1 of shapes) {
      shape1.points.forEach(function(e){ e.move() })
		for(var i = 0; i < 2; i++){//More passes is stiffer/slower
	      shape1.sticks.forEach(function(e){ e.contrain() })
	      for(var shape2 of shapes){
	         if(shape1 == shape2) continue
	         sat(shape1, shape2)
	      }
		}
      shape1.points.forEach(function(e){ e.draw() })
      shape1.sticks.forEach(function(e){ e.draw() })
   }
   if(this.mouse.up){
		shapes.push(new Block(this.mouse.pos.x, this.mouse.pos.y, 50, 50))
   }
}

function Block(x, y, width, height, speed, pin) {
   this.id = shapes.length
   this.pin = pin
   // Points
   this.points = [
      new Point(x, y, speed, pin),
      new Point(x+width, y, speed, pin),
      new Point(x+width, y+height, speed, pin),
      new Point(x, y+height, speed, pin),
   ]

   this.sticks = [
      new Stick(this.points[0], this.points[1]),
      new Stick(this.points[1], this.points[2]),
      new Stick(this.points[2], this.points[3]),
      new Stick(this.points[3], this.points[0]),
      new Stick(this.points[3], this.points[1]),
      new Stick(this.points[0], this.points[2])
   ]

   this.axis = function(){
      var axis = []
      for(var i = 0; i < this.points.length; i++){
         var point1 = this.points[i]
         var point2 = this.points[i-1] || this.points[this.points.length-1]
         axis.push({
            dir: point1.pos.clone().min(point2.pos).unit().cross(),
            points: [point1, point2]
         })
      }
      return axis
   }

   this.center = function() {
      var size = this.points[2].pos.clone().min(this.points[0].pos.clone()).scale(0.5)
      return this.points[0].pos.clone().add(size)
   }
   this.move = function(pos){
      var move = this.points[0].pos.clone().min(pos.clone())
      for(var point of this.points){
         point.pos.add(move)
      }
   }
}

function Stick(p1, p2, distance) {
   this.p1 = p1
   this.p2 = p2
   this.distance = p1.pos.distance(p2.pos)

   // This is getting dangerous
   this.contrain = function() {
      var distance = this.p1.pos.distance(this.p2.pos)
      var difference = distance - this.distance
      var percent = difference / this.distance
      var angle = this.p1.pos.clone().min(this.p2.pos).unit().scale(difference/2)

      // Pull towards
      if(!this.p1.pin){
         this.p1.pos.min(angle)
         this.p1.contrain()
      }
      if(!this.p2.pin){
         this.p2.pos.add(angle)
         this.p2.contrain()
      }
   }

   this.draw = function() {
      scene.drawLine(this.p1.pos, this.p2.pos, '#222')
   }
}

function Point(x, y, vspeed, pin) {
   this.pos = new Vector(x, y)
   this.old = this.pos.clone()

   this.old.x -= vspeed || 0
   this.pin = pin
   this.move = function() {
      if(this.pin) return
      var vVel = this.pos.clone().min(this.old).scale(set.friction)
      this.old = this.pos.clone()
      this.pos = this.pos.add(vVel).add(set.gravity)
      this.contrain()
   }

   this.draw = function() {
      scene.drawCircle(this.pos, 2, '#FFF')
   }

   this.contrain = function() {
      if(this.pin) return
      var vVel = this.pos.clone().min(this.old).scale(set.friction)
      if(this.pos.y > scene.height - 10  || this.pos.y < 10 ){
         this.pos.setY(this.pos.y < 10 ? 10 : scene.height - 10)
         this.old.setY(this.pos.y + vVel.y * set.bounce)
      }

      if(this.pos.x > scene.width || this.pos.x < 0 ){
         this.pos.setX(this.pos.x < 0 ? 0 : scene.width)
         this.old.setX(this.pos.x + vVel.x * set.bounce)
      }
   }
}


function sat(s1, s2) {
   // Minimum translation vector
   var info = {
      mtv: undefined,
      ax: undefined
   }

   // Get the axis
   var axis = s1.axis().concat(s2.axis())

   // Loop each axis
   for(var ax of axis) {
      // Get min and max of projection on each point
      var s1min = undefined
      var s1max = undefined
      var s2min = undefined
      var s2max = undefined
      for(var point of s1.points) {
         var dot = ax.dir.dot(point.pos)
         s1min = s1min ? Math.min(s1min, dot) : dot
         s1max = s1max ? Math.max(s1max, dot) : dot
      }

      for(var point of s2.points) {
         var dot = ax.dir.dot(point.pos)
         s2min = s2min ? Math.min(s2min, dot) : dot
         s2max = s2max ? Math.max(s2max, dot) : dot
      }

      // Check if there is not a collision return
      if(s1max <= s2min || s1min >= s2max){  return false; }

      // Find how much overlap
      var overlap = s1max > s2min ? s1max - s2min : s2max - s1min

      // If smaller replace
      if(!info.mtv || overlap < info.mtv.length()){
         info.ax = ax
         info.mtv = info.ax.dir.clone().scale(-overlap)
      }
   }
   // Smallest point
   var closestDistance = 999999
   var closestPoint = undefined
   for(var point of s1.points){
      //var dist = point.pos.distance(s2.center())
      var dist = point.pos.distance(s1.center().min(info.mtv))
      if(dist < closestDistance) {
         closestPoint = point
         closestDistance = dist
      }
   }

   closestPoint.pos.add(info.mtv)

   // Dampening
   var tightenOn = info.ax.dir.clone().cross()
   var currentDir = closestPoint.pos.clone().min(closestPoint.old)
   var tightness = tightenOn.dot(currentDir)
   var tighten = currentDir.scale(0.4)

   //scene.debug(tightness)
   //scene.debug('Current: ' + currentDir.toString() + ' Tighten: ' + tighten.toString())
   // Get amount in that dir
   closestPoint.pos.min(tighten.scale(0.5))

   scene.drawCircle(closestPoint.pos, 4, '#FFF')
   scene.drawLine(info.ax.points[0].pos, info.ax.points[1].pos, '#F22')
   return true
}
