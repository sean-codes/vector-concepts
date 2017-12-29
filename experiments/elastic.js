var scene = new Scene()

scene.step = function() {
   scene.debug('Mouse Pos: ' + scene.mouse.pos.toString())
   scene.debug('Mouse Old: ' + scene.mouse.old.toString())
   scene.debug('Mouse Vsp: ' + scene.mouse.speed.toString())

   scene.ctx.beginPath()
   scene.debugCircle(scene.mouse.pos, 25, 'rgba(0, 0, 0, 0.1)')
   for(var circle of circles) {
      circle.move()
      circle.draw()
      scene.ctx.lineTo(circle.pos.x, circle.pos.y)

      if(scene.mouse.speed.length() > 0) {
         //circle.pos.add(scene.mouse.pos.difference(circle.pos).scale(0.25))
         var distance = circle.pos.distance(scene.mouse.pos)
         if(distance < 25){
            circle.speed.add(scene.mouse.speed.clone().scale((1-distance/25) * 0.75))
         }
      }
   }
   scene.ctx.closePath()
   scene.ctx.fillStyle = '#46A'
   scene.ctx.fill()
   scene.ctx.strokeStyle = '#000'
   scene.ctx.stroke()
}

// Ignore for now

var radius = 50
var dir = 0
var count = 100
var circles = []
for(var i = 0; i < count; i++) {
   dir += 360/count
   var pos = new Vector(scene.center().x, scene.center().y).addCartesian(dir, radius)
   circles.push(new Point(pos))
}
// Done.

function Point(pos) {
   this.pos = pos.clone()
   this.start = this.pos.clone()
   this.speed = new Vector(0, 0)

   this.move = function() {
      // Dampen
      this.speed.min(this.speed.clone().scale(0.1))
      // Pull to center
      this.speed.add(this.start.difference(this.pos).scale(0.1))
      this.pos.add(this.speed)
   }

   this.draw = function() {
      //scene.debugCircle(this.pos, 7, '#465')
   }
}
