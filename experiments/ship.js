var canvas = document.querySelector('canvas')
var scene = new Scene(canvas)
var ship = new Triangle(scene.width/2, scene.height/2, 25, 25)
var origin = new Circle(scene.width/2, scene.height/2, 3)
ship.colorStroke = '#FFF'
origin.colorStroke = '#FFF'
canvas.style.background = '#000'
scene.addShape(ship)
scene.addShape(origin)
scene.step = function(){
   scene.clear()
   for(var shape of scene.shapes){
      scene.drawShape(shape)
   }

   if(scene.keys[39]){
      ship.rotate(5, origin.points[0])
   }
   if(scene.keys[37]){
      ship.rotate(-5, origin.points[0])
   }
   if(scene.keys[38]){
      var direction = ship.points[0].clone().min(origin.points[0]).normalize().scale(5)
      ship.direction = direction
      origin.direction = direction
      origin.move()
      ship.move()
   }
   if(scene.mouse.down && scene.keys[32]){
      origin.points[0] = scene.mouse.pos.clone()
   }

   scene.ctx.fillStyle = '#FFF'
   scene.ctx.fillText('Left to Rotate negative', 10, 20)
   scene.ctx.fillText('Right to Rotate positive', 10, 35)
   scene.ctx.fillText('Up to move away from the origin', 10, 50)
   scene.ctx.fillText('Hold space and click to move origin', 10, 65)
}
scene.start();
