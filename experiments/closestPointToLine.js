var scene = new Scene()
var circle = new Circle(scene.width/2, scene.height/2, 2)
var line = new Line(scene.width/2-100, scene.height/2, scene.width/2+100, scene.height/2+100)

scene.addShape(circle)
scene.addShape(line)

scene.step = function(){
   scene.drawShapes()

   closestPointToLine(circle.points[0], line.sides()[0])

   circle.setPos(scene.mouse.pos)
}

function closestPointToLine(point, linePoints){
   // A circle collides with a rectangle if
   // Get line direction
   var line = linePoints[1].clone().min(linePoints[0])
   var lineLength = line.length()
   var directionFromFirstPoint = point.min(linePoints[0])

   // Project point on line
   var ratioOver = line.dot(directionFromFirstPoint)/lineLength/lineLength
   scene.debug('line direction: ' + line.toString())
   scene.debug('dir form first: ' + directionFromFirstPoint.toString())
   scene.debug('dot: ' + ratioOver)
   ratioOver = Math.min(ratioOver, 1)
   ratioOver = Math.max(ratioOver, 0)
   //return
   var closest = line.scale(ratioOver).add(linePoints[0])
   scene.drawCircle(closest, 3)
   scene.debug('Meet: ' + closest)
   return closest
}
