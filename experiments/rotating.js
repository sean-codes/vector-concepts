var scene = new Scene(document.querySelector('canvas'))
var ship = new Triangle(scene.width/2, scene.height/2, 50)
var center = new Circle(scene.width/2, scene.height/2, 3)
scene.addShape(ship)
scene.addShape(center)

scene.step = function(){
   scene.clear()
   scene.drawShapes()

   ship.rotate(1)
   center.points[0] = ship.center()
}

scene.start()
