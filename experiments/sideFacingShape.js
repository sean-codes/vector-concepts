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
         if(s1.unique != s2.unique){
            var sides = sidesFacing(s1, s2)
            for(var side of sides) {
               scene.debugLine(side.points[0], side.points[1], '#FFF')
            }
         }
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

function sidesFacing(s1, s2) {
   // How to know if sides are facing each other?
   var dir1to2 = s1.center().min(s2.center())
   var dir2to1 = s2.center().min(s1.center())

   return s1.sides().concat(s2.sides()).filter(function(side) {
      var ax = side.points[0].clone().min(side.points[1]).unit().cross()

      if(side.shape == s1 && ax.dot(dir2to1) < 0) return false
      if(side.shape == s2 && ax.dot(dir1to2) < 0) return false

      return true
   })
}
