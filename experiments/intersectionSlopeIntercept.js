var scene = new Scene()

var line1 = new Line(200, 100, 300, 200)
var line2 = new Line(300, 100, 200, 200)

scene.addShape(line1)
scene.addShape(line2)
var circle = new Circle(0, 0, 3)
circle.colorFill = '#F22'
scene.addShape(circle)

scene.step = function(){
   scene.drawShapes()

}

function lineIntersection(l1, l2){
   
}
