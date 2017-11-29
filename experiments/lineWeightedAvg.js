var scene = new Scene()

// Create the shapes
var line = new Line(300, 100, 200, 200)
var circle = new Circle(0, 0, 3)
circle.colorFill = '#F22'

// Add Shapes
scene.addShape(line)
scene.addShape(circle)

// For weight
var t = 0.5

// Run it!
scene.step = function(){
   scene.drawShapes()

   if(scene.mouse.down){
      scene.keys[32]
         ? line.points[0].copy(scene.mouse.pos)
         : line.points[1].copy(scene.mouse.pos)
   }
   if(scene.keys[38] && t < 1) t+=0.01
   if(scene.keys[40] && t > 0) t-=0.01
   var midPoint = findPoint(t)
   circle.setPos(midPoint)

   scene.debug('Use up/down to move the weight')
   scene.debug('Line Length: ' + line.points[0].distance(line.points[1]))
   scene.debug('P1: ' + line.points[0].toString())
   scene.debug('P2: ' + line.points[1].toString())
   scene.debug('Center: ' + midPoint.toString())
   scene.debug('Weight (t): ' + t)
}

// Generalizing / WEighted Averages
function findPoint(t){
   var p1 = line.points[0]
   var p2 = line.points[1]

   var x = (1-t)*p1.x + t*p2.x
   var y = (1-t)*p1.y + t*p2.y
   return new Vector(x, y)
}
