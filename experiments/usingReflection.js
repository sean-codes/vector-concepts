var scene = new Scene()
scene.addShape(new Square(0, 0, scene.width-150, scene.height))
scene.addShape(new Square(scene.width/2, scene.height/2, 50))
scene.addShape(new Square(scene.width/2 - 100, scene.height/2, 50))
// scene.addShape(new Square(scene.width/2 - 100, scene.height/2- 80, 50))
// scene.addShape(new Square(scene.width/2 + 100, scene.height/2- 80, 50))
var circle = new Circle(50, 50, 5)
circle.colorFill = '#F22'

var circleDir = new Vector(2, 2)
scene.addShape(circle)
scene.step = function() {
   scene.drawShapes()
   //scene.shapes[4].rotate(3)
   moveCircle()

}

function moveCircle() {
   for(var shape of scene.shapes) {
      // Only colliding on squares right now!
      if(shape.type != 'Square') continue

      for(var side of shape.sides()) {
         sideDir = side[0].clone().min(side[1])
         circlePos = circle.points[0].clone().add(circleDir)
         circlePosRelative = side[0].clone().min(circlePos)
         scene.debug(circlePosRelative + ' ' + circlePosRelative.dot(sideDir))
         var facing = circlePosRelative.dot(sideDir)
         // Make sure they are moving in opposite directions
         if(facing > 0) {
            // Get distance from
            var closest = closestPointToLine(circle.points[0], side)
            var distance = circle.points[0].distance(closest)

            if(distance < 5 + circleDir.length()) {
               circle.back(circleDir)
               circleDir = circleDir.reflect(side[1].clone().min(side[0]))
               circle.move(circleDir)
               return
            }
         }
      }
   }
   circle.move(circleDir)
}

function closestPointToLine(point, linePoints){
   // A circle collides with a rectangle if
   // Get line direction
   var line = linePoints[1].clone().min(linePoints[0])
   var lineLength = line.length()
   var directionFromFirstPoint = point.clone().min(linePoints[0])

   // Project point on line
   var ratioOver = line.dot(directionFromFirstPoint)/lineLength/lineLength
   ratioOver = Math.min(ratioOver, 1)
   ratioOver = Math.max(ratioOver, 0)
   //return
   return line.scale(ratioOver).add(linePoints[0])
}
