var scene = new Scene()

var line1 = new Line(200, 100, 300, 200)
var line2 = new Line(300, 100, 200, 200)

scene.addShape(line1)
scene.addShape(line2)
var circle = new Circle(0, 0, 3)
circle.colorFill = '#F22'
scene.addShape(circle)

scene.step = function(){
   scene.drawShapes()

      // 1. Get direction vector
      // ax+by = d

      // 2. get perpendicular
      // (y1-y2,x2-x1)

      // 3. We have a and b
      // a = y1-y2
      // b = x2-x1

      // 4. Try one of the points
      // ax+by = d


}

function lineIntersection(l1, l2){
   var l1c =
   var l1a =
   var l1b =

   var l2c =
   var l2a =
   var l2b =

   var denomenator =
   if(!denomenator) return false
   var x =
   var y =


}
