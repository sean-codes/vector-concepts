var scene = new Scene()
scene.ctx.canvas.style.background = '#222'
var squares = []
for(var i = 0; i < 5; i++){
   squares.push(new Square(
         Math.random() * scene.width,
         Math.random() * scene.height,
         Math.random()*50 + 50)
   )
}

var light = new Circle(scene.width/2, scene.height/2, 3)
light.direction = new Vector(Math.random()*5-2.5, Math.random()*5-2.5)
light.colorFill = '#F22'

scene.addShapes(squares)
scene.addShape(light)

scene.step = function(){

   for(var square of squares) { square.rotate(1), square.colorFill = '#D45'}

   var direction = 0
   var radius = 1000
   while(direction < 360) {
      direction += 0.1
      // Switch polar to cartesian
      // Direction + Length to X/Y
      var lightCast = new Vector(
         Math.cos(direction * Math.PI/180) * radius + light.points[0].x,
         Math.sin(direction * Math.PI/180) * radius + light.points[0].y
      )

      var closestDistance = undefined
      var closestIntersection = undefined

      for(var shape of scene.shapes) {
         if(shape.type != 'Square') continue
         for(var side of shape.sides()){
            var hit = lineIntersection(side[0], side[1], light.points[0], lightCast)

            if(hit) {
               var distance = light.points[0].distance(new Vector(hit.x, hit.y))
               if(!closestDistance || closestDistance > distance) {

                  closestIntersection = hit
                  closestDistance = distance
               }
            }
         }
      }
      scene.ctx.strokeStyle = '#cdcdcd'
      scene.debugLine(light.points[0], closestIntersection ? closestIntersection : lightCast)
      //if(closestIntersection) scene.debugCircle(closestIntersection, 3, '#465')
   }
   if(scene.mouse.down) light.setPos(scene.mouse.pos)
   scene.drawShapes()
   scene.debug('Casting 3600 Lines around a point', '#FFF')
   //scene.stop()
   light.move(light.direction)
   if(light.points[0].x < 0 || light.points[0].x > scene.width){
      light.direction.x = light.direction.x*-1
   }
   if(light.points[0].y < 0 || light.points[0].y > scene.height){
      light.direction.y = light.direction.y*-1
      //light.move(light.direction)
   }
}

function lineIntersection(s1, e1, s2, e2){
   // Get the D1/D2
   var d1 = { x: e1.x - s1.x, y: e1.y - s1.y }
   var d2 = { x: e2.x - s2.x, y: e2.y - s2.y }

   // Isolate T1 and then solve T2
   var t2 = (s2.y*d1.x - s1.y*d1.x - s2.x*d1.y + s1.x*d1.y)/(d2.x*d1.y - d2.y*d1.x)
   var t1 = d1.x ? (s2.x + d2.x * t2 - s1.x) / d1.x : (s2.y + d2.y * t2 - s1.y)/d1.y

   if(t1 < 0 || t2 < 0 || t1 > 1 || t2 > 1){ return undefined }
   return new Vector(
      s1.x + d1.x * t1,
      s1.y + d1.y * t1
   )
}
