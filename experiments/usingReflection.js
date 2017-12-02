var scene = new Scene()
scene.addShape(new Square(0, 0, scene.width, scene.height))
scene.addShape(new Square(scene.width/2, scene.height/2, 50))
scene.addShape(new Square(scene.width/2 - 100, scene.height/2, 50))
scene.addShape(new Square(scene.width/2 - 100, scene.height/2- 80, 50))
scene.addShape(new Square(scene.width/2 + 100, scene.height/2- 80, 50))
var circle = new Circle(50, 50, 5)
circle.colorFill = '#F22'

var circleDir = new Vector(2, 2)
scene.addShape(circle)
scene.step = function() {
   scene.drawShapes()
   scene.shapes[4].rotate(3)

   for(var shape of scene.shapes){
      if(shape.type != 'Square') continue
      var closest = undefined
      var closestDistance = undefined
      for(var side of shape.sides()){
         var check = closestPointToLine(circle.points[0], side)
         scene.drawCircle(check, 3)
         var distance = check.distance(circle.points[0])
         if(!closest || distance < closestDistance){
            closest = side
            closestDistance = check.distance(circle.points[0])
         }
      }
      if(typeof closest != 'undefined' && closestDistance < 5){
         circleDir = circleDir.reflect(closest[1].clone().min(closest[0]))
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
