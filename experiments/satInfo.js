var scene = new Scene()
var heldShape = 0
scene.addShape(new Square(scene.width/2, scene.height/2, 50))
//scene.addShape(new Square(scene.width/2 +100, scene.height/2, 50))
scene.addShape(new Square(scene.width/2 - 100, scene.height/2, 50))
scene.shapes[1].rotate(15);

scene.step = function() {
   //scene.shapes[1].rotate(0.5)
   scene.drawShapes()

   // Check for collision
   //sat(scene.shapes[0], scene.shapes[1])
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
   // Directions
   var dir1to2 = s1.center().min(s2.center())
   var dir2to1 = s2.center().min(s1.center())
   // Minimum translation vector
   var info = {
      mtv: undefined,
      axis: undefined
   }

   // Get the axis
   var sides = s2.sides().concat(s1.sides())
   // Loop each axis
   for(var side of sides) {
      var ax = side.points[0].clone().min(side.points[1]).unit().cross()

      // Get min and max of projection on each point
      if(side.shape == s1 && ax.dot(dir2to1) < 0) continue
      if(side.shape == s2 && ax.dot(dir1to2) < 0) continue
      scene.debugLine(side.points[0], side.points[1], '#FFF')

      var s1proj = project(s1, ax)
      var s2proj = project(s2, ax)

      // Check if there is not a collision return
      if(s1proj.max <= s2proj.min || s1proj.min >= s2proj.max){  return false; }

      // Find how much overlap
      var overlap = s1proj.max >= s2proj.min ? s2proj.min - s1proj.max : s2proj.max - s1proj.min

      // If smaller replace
      if(!info.mtv || Math.abs(overlap) <= info.mtv.length()){
         info.side = side
         info.ax = ax
         info.overlap = overlap
         info.mtv = info.ax.clone().scale(overlap)
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
   scene.debugCircle(s1.center().add(info.mtv), 3, '#F22')
   scene.debugLine(s1.center().add(info.mtv), s1.center(), '#F22')
   scene.debugLine(
      s1.center().clone().add(info.mtv).add(info.ax.clone().cross().scale(1)),
      s1.center().clone().add(info.mtv).add(info.ax.clone().cross().scale(-1)),
      '#F22')
   scene.debugCircle(closestPoint, 3, '#F22')
   scene.debugLine(info.side.points[0], info.side.points[1], '#FFF')
   scene.debugText(s1.points[0], info.mtv.toString())
   s1.move(info.mtv)
   return true
}

function project(shape, ax){
   var min = undefined, max = undefined

   for(var point of shape.points){
      var dot = ax.dot(point)
      min = min ? Math.min(min, dot) : dot
      max = max ? Math.max(max, dot) : dot
   }

   return { min: min, max: max }
}
