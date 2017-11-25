var scene = new Scene()

var vCenter = new Vector(scene.width/2, scene.height/2)
var box0 = new Square(vCenter.x, vCenter.y, 50)
var box1 = new Square(vCenter.x, vCenter.y, 50)

scene.addShape(box0)

scene.step = function(){
   scene.drawShapes()

   box0.rotate(3)

   var axis = box0.axis()
   var center = box0.center()
   for(var ax of axis){
      scene.drawLine(center, center.clone().add(ax.scale(40).cross()))
   }
   //scene.stop()
}
