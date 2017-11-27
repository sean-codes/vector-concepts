var scene = new Scene()
var heldShape = 0
scene.addShape(new Square(scene.width/2 + 30, scene.height/2, 50))
scene.addShape(new Square(scene.width/2 - 30, scene.height/2, 50))
scene.addShape(new Square(scene.width/2 - 30, scene.height/2, 50))


scene.step = function() {
   scene.shapes[1].rotate(0.5)
   scene.drawShapes()

   // Check for collision
   for(var s1 of scene.shapes) {
      for(var s2 of scene.shapes) {
         if(s1.unique != s2.unique) sat(s1, s2)
      }
   }

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
   var mtv = undefined

   // Get the axis
   var axis = s1.axis().concat(s2.axis())

   // Loop each axis
   for(var ax of axis) {
      // Get min and max of projection on each point
      var s1min = undefined
      var s1max = undefined
      var s2min = undefined
      var s2max = undefined

      for(var point of s1.points) {
         var dot = ax.dot(point)
         s1min = s1min ? Math.min(s1min, dot) : dot
         s1max = s1max ? Math.max(s1max, dot) : dot
      }

      for(var point of s2.points) {
         var dot = ax.dot(point)
         s2min = s2min ? Math.min(s2min, dot) : dot
         s2max = s2max ? Math.max(s2max, dot) : dot
      }

      // Check if there is not a collision return
      if(s1max <= s2min || s1min >= s2max){  return false; }

      // Find how much overlap
      var overlap = s1max > s2min ? s1max - s2min : s2max - s1min

      // If smaller replace
      var mtv = !mtv || overlap < mtv.length() ? ax.scale(overlap) : mtv
   }

   s2.move(mtv)
   return true
}
