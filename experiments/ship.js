var scene = new Scene(document.querySelector('canvas'))
var ship = new Triangle(scene.width/2, scene.height/2, 25, 25)
scene.addShape(ship)
scene.step = function(){
   scene.clear()
   for(var shape of scene.shapes){
      scene.drawShape(shape)
   }

   if(scene.keys[39]){
      ship.rotate(2, new Vector(scene.width/2, scene.height/2))
   }
   if(scene.keys[37]){
      ship.rotate(-2, new Vector(scene.width/2, scene.height/2))
   }

   scene.ctx.fillStyle = '#000'
   scene.ctx.fillText('Use Left to Rotate negative', 10, 20)
   scene.ctx.fillText('Use Right to Rotate positive', 10, 35)
}
scene.start();
