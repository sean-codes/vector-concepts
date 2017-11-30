var scene = new Scene()
var squares = []
for(var i = 0; i < 5; i++){
   squares.push(new Square(
         Math.random() * scene.width,
         Math.random() * scene.height,
         Math.random()*50 + 50)
   )
}

var light = {
   p1: new Vector(scene.width/2, scene.height/2),
   p2: new Vector(scene.width/2, scene.height/2)
}

scene.addShapes(squares)

scene.step = function(){
   for(var square of squares) { square.rotate(Math.random()*-2), square.colorFill = '#D45'}
   scene.drawShapes()
   var closestDistance = undefined
   var closestIntersection = undefined
   for(var shape of scene.shapes) {
      for(var side of shape.sides()){
         var hit = lineIntersection(side[0], side[1], light.p1, light.p2 )

         if(hit) {
            var distance = light.p1.distance(new Vector(hit.x, hit.y))
            if(!closestDistance || closestDistance > distance) {
               closestIntersection = hit
               closestDistance = distance
            }
         }
      }


   }
   if(closestIntersection) scene.drawCircle(closestIntersection, 3, '#465')
   scene.drawLine(light.p1, closestIntersection || light.p2)
   if(scene.mouse.down) light.p2.copy(scene.mouse.pos)

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
