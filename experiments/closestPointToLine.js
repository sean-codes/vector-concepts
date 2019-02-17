var scene = new Scene()

var circle = new Circle(scene.width/2, scene.height/2, 2)
var line = new Line(scene.width/2-100, scene.height/2, scene.width/2+100, scene.height/2+100)

scene.addShapes([circle, line])

scene.step = function(){
   scene.drawShapes()

   // set circle to mouse position
   circle.setPos(scene.mouse.pos)

   var point = circle.points[0]
   var linePoints = line.sides()[0].points
   var closestPointOnLine = closestPointOnLineToPoint(linePoints, point)
   scene.debug(closestPointOnLine.toString())
   scene.debugCircle(closestPointOnLine, 3, '#F22')
}


function closestPointOnLineToPoint(linePoints, point) {
   // steps to get the closest point on line to a point
   // 1. get the direction of the line
   var directionOfLine = linePoints[1].clone().min(linePoints[0]).unit()

   // 2. get the direction of the point relative to the line
   var pointRelativeToLine = point.clone().min(linePoints[0])

   // 3. project (dot product the point onto that direction)
   var dotPointOntoLine = pointRelativeToLine.dot(directionOfLine)

   // 4. keep the that value within the length of the line
   var lengthOfLine = linePoints[1].clone().min(linePoints[0]).length()
   var scale = Math.min(lengthOfLine, Math.max(0, dotPointOntoLine))

   // 5. scale the direction of line by the final dot
   return linePoints[0].clone().add(directionOfLine.scale(scale))
}
