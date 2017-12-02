var scene = new Scene()
// Walls
scene.addShape(new Line(scene.width-10, scene.height-10, scene.width - 10, 10))
scene.addShape(new Line(10, 10, 10, scene.height-10))
scene.addShape(new Line(10, scene.height-10, scene.width-10, scene.height-10))
scene.addShape(new Line(scene.width-10, 10, 10, 10))
//scene.addShape(new Square(0, 0, scene.width-150, scene.height))
scene.addShape(new Square(scene.width/2, scene.height/2, 50))
scene.addShape(new Square(scene.width/2 - 100, scene.height/2+20, 50))
scene.addShape(new Square(scene.width/2 - 100, scene.height/2- 70, 50))
scene.addShape(new Square(scene.width/2 + 100, scene.height/2- 70, 50))
var circles = [
   new Circle(243.5333, 115.012, 5),
   new Circle(200, 115.012, 5),
   new Circle(0.5333, 115.012, 5),
   new Circle(243.5333, 115.012, 5),
   new Circle(243.5333, 115.012, 5)
]
//circle.colorFill = '#F22'
var circleDir = new Vector(-2, 3)

scene.addShapes(circles)
scene.step = function() {
   //scene.shapes[2].rotate(2)
   scene.drawShapes()
   scene.shapes[4].rotate(3)
   for(var circle of circles){
      moveCircle(circle)
   }
}

function moveCircle(circle) {
   if(!circle.dir) circle.dir = new Vector(Math.random()*2+1, Math.random()*2+1)
   circle.colorFill = '#F22'
   for(var shape of scene.shapes) {
      // Only colliding on squares right now!
      if(shape.type == 'Circle') continue

      for(var side of shape.sides()) {
         sideDir = side[0].clone().min(side[1])
         var centerOfSide = side[0].clone().min(sideDir.clone().scale(0.5))
         var crossOfSide = centerOfSide.clone().add(sideDir.cross().unit().scale(-5))
         scene.drawCircle(centerOfSide, 3)
         scene.drawCircle(crossOfSide, 3, '#F22')
         var sideDir = centerOfSide.min(crossOfSide)
         var facing = sideDir.dot(circle.dir)
         // Make sure they are moving in opposite directions
         //scene.debug(facing)
         if(facing > 0) {
            // Get distance from
            var closest = closestPointToLine(circle.points[0], side)
            var distance = circle.points[0].distance(closest)

            if(distance < 5 + circle.dir.length()) {
               circle.back(circle.dir)
               circle.dir = circle.dir.reflect(side[1].clone().min(side[0]))
               circle.move(circle.dir)
               return
            }
         }
      }
   }
   circle.move(circle.dir)
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
