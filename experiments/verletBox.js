var scene = new Scene()
scene.setSpeed(30)
// Settings
var set = {
   gravity: new Vector(0, 0.2),
   bounce: 0.9,
   friction: 0.97
}

// Points
var points = [
   new Point(10, 10),
   new Point(50, 10),
   new Point(50, 50),
   new Point(10, 50, 10),

]

var sticks = [
   new Stick(points[0], points[1]),
   new Stick(points[1], points[2]),
   new Stick(points[2], points[3]),
   new Stick(points[3], points[0]),
   new Stick(points[0], points[2]),
   new Stick(points[1], points[3]),
   //new Stick(points[1], points[3]),
]

scene.step = function() {
   points.forEach(function(e){ e.move() })
   sticks.forEach(function(e){ e.contrain() })
   points.forEach(function(e){ e.draw() })
   sticks.forEach(function(e){ e.draw() })
}

// Contrains
function Stick(p1, p2, distance) {
   this.p1 = p1
   this.p2 = p2
   this.distance = p1.pos.distance(p2.pos)

   this.contrain = function() {
      var distance = this.p1.pos.distance(this.p2.pos)
      var difference = distance - this.distance
      var percent = difference / this.distance
      var angle = this.p1.pos.clone().min(this.p2.pos).unit().scale(difference/2)

      scene.debug(angle)
      this.p1.pos.min(angle)
      this.p2.pos.add(angle)
      this.p1.contrain()
      this.p2.contrain()
   }

   this.draw = function() {
      scene.debugLine(this.p1.pos, this.p2.pos)
   }
}

function Point(x, y, vspeed) {
   this.pos = new Vector(x, y)
   this.old = this.pos.clone().min(new Vector(vspeed || 4, 2))

   this.move = function() {
      var vVel = this.pos.clone().min(this.old).scale(set.friction)
      this.old = this.pos.clone()
      this.pos = this.pos.add(vVel).add(set.gravity)
      this.contrain()
   }

   this.draw = function() {
      scene.debugCircle(this.pos, 3)
   }

   this.contrain = function() {
      var vVel = this.pos.clone().min(this.old).scale(set.friction)
      if(this.pos.y > scene.height || this.pos.y < 0 ){
         this.pos.setY(this.pos.y < 0 ? 0 : scene.height)
         this.old.setY(this.pos.y + vVel.y * set.bounce)
      }

      if(this.pos.x > scene.width || this.pos.x < 0 ){
         this.pos.setX(this.pos.x < 0 ? 0 : scene.width)
         this.old.setX(this.pos.x + vVel.x * set.bounce)
      }
   }
}
