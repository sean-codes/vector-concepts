var scene = new Scene(document.querySelector('canvas'))
var ship = new Triangle(scene.width/2, scene.height/2, 25, 25)

scene.addShape(ship)
scene.step = function(){
   for(var shape of scene.shapes){
      scene.drawShape(shape)
   }

   if(scene.keys[39]){
      console.log('right arrow')
      ship.rotate(1, new Vector(scene.width/2, scene.height/2))
   }
}
scene.start();
