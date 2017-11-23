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
}
scene.start();
