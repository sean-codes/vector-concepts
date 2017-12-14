var scene = new Scene()
scene.ctx.canvas.style.background = '#111'
// Walls
scene.addShape(new Line(scene.width-10, 10, 10, 10, '#333'))
scene.addShape(new Line(scene.width-10, scene.height-10, scene.width - 10, 10, '#333'))
scene.addShape(new Line(10, scene.height-10, scene.width-10, scene.height-10, '#333'))
scene.addShape(new Line(10, 10, 10, scene.height-10, '#333'))
//scene.addShape(new Square(0, 0, scene.width-150, scene.height))
scene.addShape(new Square(scene.width/2, scene.height/2, 50, 50, randomColor()))
scene.addShape(new Square(scene.width/2 - 100, scene.height/2+20, 50, 50, randomColor()))
scene.addShape(new Square(scene.width/2 - 100, scene.height/2- 70, 50, 50, randomColor()))
scene.addShape(new Square(scene.width/2 + 100, scene.height/2- 70, 50, 90, randomColor()))
var circles = [
   new Circle(20, 115.012, 5),
   new Circle(200, 115.012, 5),
   new Circle(0.5333, 115.012, 10),
   new Circle(243.5333, 115.012, 5),
   new Circle(243.5333, 115.012, 5)
]
//circle.colorFill = '#F22'
var circleDir = new Vector(-2, 3)

scene.addShapes(circles)
scene.step = function() {
   //scene.shapes[2].rotate(2)
   scene.drawShapes()
   scene.shapes[4].rotate(0.5)
   for(var circle of circles){
      moveCircle(circle)
   }
}

function moveCircle(circle) {
   if(!circle.dir) circle.dir = new Vector(Math.random()*2+1, Math.random()*2+1)
   if(circle.colorFill == 'transparent') { circle.colorFill = randomColor() }
   for(var shape of scene.shapes) {
      // Only colliding on squares right now!
      if(shape.type == 'Circle') continue

      for(var side of shape.sides()) {

         // Find out if the circle is facing the right side
         var sideDir = side.points[0].clone().min(side.points[1])
         var sideCross = sideDir.clone().cross()
         var facing = sideCross.dot(circle.dir)

         // How much over?
         var circleRelation = side.points[0].clone().min(circle.points[0])
         var over = circleRelation.dot(sideDir.unit())
         //scene.debug(sideDir + ' : ' + over)

         if(facing < 0 && over > 0 && over < sideDir.length()) {
            scene.debugCircle(side.points[0].clone().min(sideDir.unit().scale(over)), 3, circle.colorFill)
            // Get distance from
            var closest = closestPointToLine(circle.points[0], side)
            var distance = circle.points[0].distance(closest)

            if(distance < circle.radius + circle.dir.length()) {
               circle.back(circle.dir)
               circle.dir = circle.dir.reflect(side.points[1].clone().min(side.points[0]))
               circle.move(circle.dir)
               //return
            }
         }
      }
   }
   circle.move(circle.dir)
}

function closestPointToLine(point, linePoints){
   // A circle collides with a rectangle if
   // Get line direction
   var line = linePoints.points[1].clone().min(linePoints.points[0])
   var lineLength = line.length()
   var directionFromFirstPoint = point.clone().min(linePoints.points[0])

   // Project point on line
   var ratioOver = line.dot(directionFromFirstPoint)/lineLength/lineLength
   ratioOver = Math.min(ratioOver, 1)
   ratioOver = Math.max(ratioOver, 0)
   //return
   return line.scale(ratioOver).add(linePoints.points[0])
}

function randomColor() {
   var r = Math.floor(Math.random()*255)
   var g = Math.floor(Math.random()*255)
   var b = Math.floor(Math.random()*255)

   return `rgb(${r}, ${g}, ${b})`
}
