var scene = new Scene()
scene.addShape(new Square(scene.width/2, scene.height/2, 50))
scene.addShape(new Triangle(scene.width/2-110, scene.height/2, 50))

scene.step = function() {
   scene.drawShapes()

   // Loop each shape. Check for a collision
   sat(scene.shapes[0], scene.shapes[1])

   if(scene.mouse.down){
      scene.shapes[0].setPos(scene.mouse.pos)
   }

   //scene.shapes[1].rotate(1)
   scene.debug('Click and hold to set triangle position!')
   scene.shapes[1].rotate(1)
}

function sat(shape0, shape1) {
   // Gather all the AXIS
   var axis = shape1.axis().concat(shape0.axis())
   var touch = true
   var mtv = undefined
   // console.log(axis)
   for(var ax of axis) {
      var shape0Min = undefined
      var shape0Max = undefined
      var shape1Min = undefined
      var shape1Max = undefined
      // Gather the Min/Max
      for( var point of shape0.points) {
         var dot = ax.dot(point)
         shape0Min = shape0Min ? Math.min(shape0Min, dot) : dot
         shape0Max = shape0Max ? Math.max(shape0Max, dot) : dot
      }

      for(var point of shape1.points) {
         var dot = ax.dot(point)
         shape1Min = shape1Min ? Math.min(shape1Min, dot) : dot
         shape1Max = shape1Max ? Math.max(shape1Max, dot) : dot
      }

      // Check for collision
      if(shape0Min > shape1Max || shape0Max < shape1Min) {
         return false
      }

      var overlap = shape0Max > shape1Min ? shape0Max - shape1Min : shape0Min - shape1Max
      //onsole.log(ax.x, ax.y, shape0Min, shape0Max, shape1Min, shape1Max, overlap)
      mtv = !mtv || Math.abs(overlap) < mtv.length() ? ax.scale(overlap) : mtv

      //console.log(overlap)

      //mtv.add(ax.scale(overlap))
   }

   //console.log(mtv.x, mtv.y)
   //console.log(ax.scale(overlap))
   //shape0.move(ax.scale(overlap))
   if(mtv) shape1.move(mtv)
   return true
}
