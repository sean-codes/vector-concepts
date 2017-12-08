var scene = new Scene()
var boundary = scene.sides()
var testVel = new Vector(2, 2)

var points = [
   new Point(10, 10, testVel)
]

scene.step = function() {
   // Move
   for(var point of points) {
      point.move()
   }

   // Draw
   for(var point of points) {
      point.draw()
   }
}


function Point(x, y, vel) {
   this.pos = new Vector(x, y)
   this.old = this.pos.clone().min(vel)

   this.move = function() {
      var vel = this.pos.clone().min(this.old)
      this.old = this.pos.clone()
      this.pos.add(vel)

      this.constrain()
   }

   this.draw = function() {
      scene.debugCircle(this.pos, 3, '#2F2')
   }

   this.constrain = function() {
      this.vel = this.pos.clone().min(this.old)
      if(this.pos.x > scene.width || this.pos.x < 0){
         this.pos.x = this.pos.x < 0 ? 0 : scene.width
         this.old.x = this.pos.x + this.vel.x
      }

      if(this.pos.y > scene.height || this.pos.y < 0){
         this.pos.y = this.pos.y < 0 ? 0 : scene.height
         this.old.y = this.pos.y + this.vel.y
      }
   }
}
