var scene = new Scene()
var heldShape = 0
scene.addShape(new Square(scene.width/2 + 30, scene.height/2, 50))
scene.addShape(new Square(scene.width/2 - 30, scene.height/2, 50))


scene.step = function() {
   //scene.shapes[1].rotate(0.5)
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
   var info = {
      mtv: undefined,
      axis: undefined
   }

   // Get the axis
   var axis = s1.axis().concat(s2.axis())

   // Loop each axis
   for(var ax of axis) {
      // Get min and max of projection on each point
      var s1proj = project(s1, ax)
      var s2proj = project(s2, ax)

      // Check if there is not a collision return
      if(s1proj.max <= s2proj.min || s1proj.min >= s2proj.max){  return false; }

      // Find how much overlap
      var overlap = s1proj.max >= s2proj.min ? s2proj.min - s1proj.max : s2proj.max - s1proj.min

      // If smaller replace
      if(!info.mtv || Math.abs(overlap) < info.mtv.length()){
         info.overlap = overlap
         info.ax = ax
         info.mtv = info.ax.scale(overlap)
      }
   }

   s1.move(info.mtv)
   scene.drawLine(info.ax, info, '#F22')
   scene.drawText(s1.points[0], info.overlap + ' ' + info.mtv.toString())
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
