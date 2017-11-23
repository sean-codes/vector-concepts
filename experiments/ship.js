var scene = new Scene(document.querySelector('canvas'))
var ship = new Triangle(scene.width/2, scene.height/2, 25, 25)
var origin = new Circle(scene.width/2, scene.height/2, 3)

origin.fillColor = '#465'

scene.addShape(ship)
scene.addShape(origin)
scene.step = function(){
   scene.clear()
   for(var shape of scene.shapes){
      scene.drawShape(shape)
   }

   if(scene.keys[39]){
      ship.rotate(2, origin.points[0])
   }
   if(scene.keys[37]){
      ship.rotate(-2, origin.points[0])
   }

   if(scene.mouse.down){
      origin.points[0] = scene.mouse.pos.clone()
   }

   scene.ctx.fillStyle = '#000'
   scene.ctx.fillText('Use Left to Rotate negative', 10, 20)
   scene.ctx.fillText('Use Right to Rotate positive', 10, 35)
}
scene.start();
