var scene = new Scene(document.querySelector('canvas'))
var vCenter = new Vector(scene.width/2, scene.height/2)

var block0 = new Square(vCenter.x, vCenter.y, 50)
var block1 = new Square(vCenter.x - 100, vCenter.y, 50)

scene.addShape(block0)
scene.addShape(block1)

scene.step = function() {
   scene.clear()
   scene.drawShapes()

   if(scene.mouse.down){
      block0.setPos(scene.mouse.pos)
   }
}
