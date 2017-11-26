var scene = new Scene()

var vCenter = new Vector(scene.width/2, scene.height/2)
var boxes = [
   new Square(vCenter.x, vCenter.y, 50),
   new Square(vCenter.x+75, vCenter.y, 50),
   new Triangle(vCenter.x-75, vCenter.y, 50),
]

scene.addShape(boxes[0])
scene.addShape(boxes[1])
scene.addShape(boxes[2])


scene.step = function(){
   scene.debug('Hold mouse down to move shape')
   scene.drawShapes()
   boxes[0].rotate(0.25)
   for(var shape1 of scene.shapes){
      var touch = sat(shape1)
      shape1.colorStroke = touch ? '#F22' : '#000';
   }

   if(scene.mouse.down) {
      scene.keys[32]
         ? boxes[0].setPos(scene.mouse.pos)
         : boxes[1].setPos(scene.mouse.pos)
   }

}


function sat(checkShape) {
   var checkAxis = checkShape.axis()
   // Loop each shape
   for(var shape of scene.shapes) {
      if(shape.unique == checkShape.unique) continue;
      // Check each Axis
      var axisArr = shape.axis().concat(checkAxis)
      var touch = true
      for(var axis of axisArr) {
         // Pairs
         var shapeMinMax = {x: undefined, y: undefined}
         var checkMinMax = {x: undefined, y: undefined}

         // Check current shape
         for(var point of shape.points){
            var dot = point.dot(axis)
            shapeMinMax.min = shapeMinMax.min ? Math.min(shapeMinMax.min, dot) : dot
            shapeMinMax.max = shapeMinMax.max ? Math.max(shapeMinMax.max, dot) : dot
         }

         // Check the checkshape on the axis
         for(var point of checkShape.points){
            var dot = point.dot(axis)
            checkMinMax.min = checkMinMax.min ? Math.min(checkMinMax.min, dot) : dot
            checkMinMax.max = checkMinMax.max ? Math.max(checkMinMax.max, dot) : dot
         }

         // Return if no touch
         if(checkMinMax.min > shapeMinMax.max || checkMinMax.max < shapeMinMax.min){
            touch = false
            break
         }
      }
      if(!touch){ continue }
      return true
   }
   return false
}
