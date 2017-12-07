var scene = new Scene()
scene.addShape(new Square(scene.width/2, scene.height/2, 50))
scene.addShape(new Square(scene.width/2-110, scene.height/2, 50))
scene.addShape(new Triangle(scene.width/2 - 35, scene.height/2+20, 50))

scene.step = function() {
   scene.drawShapes()

   // Loop each shape. Check for a collision
   for(var shape of scene.shapes) {
      shape.colorStroke = sat(shape) ? '#F22' : '#000'
   }

   if(scene.mouse.down){
      scene.shapes[2].setPos(scene.mouse.pos)
   }

   scene.shapes[1].rotate(1)
   scene.debug('Click and hold to set triangle position!')
}

function sat(check) {

   // Loop each shape
   for(var shape of scene.shapes) {
      if(shape.unique == check.unique) continue
      // Gather all the AXIS
      var axis = shape.axis().concat(check.axis())
      var touch = true

      for(var ax of axis) {
         var checkMin = undefined
         var checkMax = undefined
         var shapeMin = undefined
         var shapeMax = undefined
         // Gather the Min/Max
         for(var point of shape.points) {
            var dot = point.dot(ax.dir)
            shapeMin = shapeMin ? Math.min(shapeMin, dot) : dot
            shapeMax = shapeMax ? Math.max(shapeMax, dot) : dot
         }

         for( var point of check.points) {
            var dot = point.dot(ax.dir)
            checkMin = checkMin ? Math.min(checkMin, dot) : dot
            checkMax = checkMax ? Math.max(checkMax, dot) : dot
         }

         // Check for collision
         if(checkMin > shapeMax || checkMax < shapeMin) {
            touch = false
            break
         }
      }
      if(!touch) continue
      return true
   }

   return false
}
