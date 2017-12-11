var scene = new Scene()
var heldShape = 0
scene.addShape(new Square(scene.width/2, scene.height/2, 50))
//scene.addShape(new Square(scene.width/2 +100, scene.height/2, 50))
scene.addShape(new Square(scene.width/2 - 100, scene.height/2, 50))
scene.shapes[1].rotate(5);
scene.shapes[0].rotate(-15.2);

scene.step = function() {
   //scene.shapes[1].rotate(0.5)
   scene.drawShapes()

   // Check for collision
   //sat(scene.shapes[0], scene.shapes[1])
   sat(scene.shapes[0], scene.shapes[1])
   // for(var s1 of scene.shapes) {
   //    for(var s2 of scene.shapes) {
   //       if(s1.unique != s2.unique) sat(s1, s2)
   //    }
   // }

   // Move Shape
   if(scene.mouse.down) {
      var pos = scene.mouse.pos.clone().add(new Vector(-25, -25))
      scene.shapes[0].setPos(pos)
   }
   if(scene.keys[37]){
      scene.shapes[0].move(new Vector(-1, 0))
   }
}

function sat(s1, s2) {
   // Minimum translation vector
   minOverlap = 99999
   minSide = undefined
   minAxis = undefined

   // Get the axis
   var sides = s1.sides().concat(s2.sides())
   // Loop each axis
   for(var side of sides) {
      var ax = side.points[0].clone().min(side.points[1]).unit().cross()
      //scene.debug(ax.toString())
      var [min0, max0] = project(s1, ax)
      var [min1, max1] = project(s2, ax)

      // Check if there is not a collision return

      var distance = min0 < min1 ? max0 - min1 : max1 - min0
      if(distance < 0) return

      if (distance < minOverlap){
         minOverlap = distance
         minSide = side
         minAxis = ax.clone()
      }
   }
   //return
   // Smallest point
   var closestDistance = 999999
   var closestPoint = undefined
   for(var point of s1.points){
      var dist = point.distance(s2.center())
      if(dist < closestDistance) {
         closestPoint = point
         closestDistance = dist
      }
   }

   scene.debugLine(minSide.points[0], minSide.points[1], '#FFF')
   scene.debugCircle(minSide.points[0], 3, '#465')
   scene.debugCircle(minSide.points[1], 3, '#465')
   //s1.move(info.mtv)
   return true
}

function project(shape, ax){
   let max = -99999
   let min = 99999
   for (let point of shape.points) {
      const d = ax.dot(point)
      if (d > max) max = d
      if (d < min) min = d
   }
   return [min, max]
}
