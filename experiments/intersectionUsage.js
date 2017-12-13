var scene = new Scene()
var squares = []
for(var i = 0; i < 5; i++){
   squares.push(new Square(
         Math.random() * scene.width,
         Math.random() * scene.height,
         Math.random()*50 + 50)
   )
}
scene.addShapes(squares)
for(var i = 0; i < scene.width/10; i++){
   scene.addShape(new Line(i*scene.width/10, 0, i*scene.width/10, scene.height))
}

for(var i = 0; i < scene.height/5; i++){
   scene.addShape(new Line(0, i*scene.height/5, scene.width, i*scene.height/5))
}
scene.step = function(){
   for(var square of squares) {square.rotate(Math.random()*-2), square.colorFill = '#D45'}
   scene.drawShapes()
   var intersections = []
   for(var shape1 of scene.shapes) {
      //if(shape1.type == 'Line'){
      for(var line1 of shape1.sides()){
         for(var shape2 of scene.shapes) {
            if(shape1.unique == shape2.unique) continue

            for(var line2 of shape2.sides()) {
               var intersection = lineIntersection(line1.points[0], line1.points[1], line2.points[0], line2.points[1] )

               if(intersection){
                  intersections.push(intersection)
               }
            }
         }
      }
   }
   for(var intersection of intersections) {
      scene.debugCircle(intersection, 3, '#465')
   }

   if(scene.mouse.down) square.setPos(scene.mouse.pos)

   //scene.stop()
}

function lineIntersection(s1, e1, s2, e2){
   // Get the D1/D2
   var d1 = { x: e1.x - s1.x, y: e1.y - s1.y }
   var d2 = { x: e2.x - s2.x, y: e2.y - s2.y }

   // Isolate T1 and then solve T2
   var t2 = (s2.y*d1.x - s1.y*d1.x - s2.x*d1.y + s1.x*d1.y)/(d2.x*d1.y - d2.y*d1.x)
   var t1 = d1.x ? (s2.x + d2.x * t2 - s1.x) / d1.x : (s2.y + d2.y * t2 - s1.y)/d1.y

   if(t1 < 0 || t2 < 0 || t1 > 1 || t2 > 1) return
   return new Vector(
      s1.x + d1.x * t1,
      s1.y + d1.y * t1
   )
}
