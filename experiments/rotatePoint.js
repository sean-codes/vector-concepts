var scene = new Scene(document.querySelector('canvas'))
var circle = new Circle(scene.width/2, scene.height/2, 10)
var circleGhost = new Circle(scene.width/2, scene.height/2, 10)
var gravity = new Circle(scene.width/2, scene.height/2, 5)
var angle = 0
var vCenter = new Vector(scene.width/2, scene.height/2)
gravity.colorFill = '#D44'
circle.colorFill = '#4a7'

scene.addShape(circle)
scene.addShape(circleGhost)
scene.addShape(gravity)

scene.step = function(){
   scene.clear()
   angle += 10
   if(angle == 360){ angle = 1 }
   if(scene.mouse.down){
      gravity.points[0].x = scene.mouse.pos.x
      gravity.points[0].y = scene.mouse.pos.y
   }
   var radius = gravity.points[0].distance(vCenter)
   circle.points[0].x = Math.cos(angle * Math.PI/180) * radius + gravity.points[0].x
   circle.points[0].y = Math.sin(angle * Math.PI/180) * radius + gravity.points[0].y

   for(var shape of scene.shapes){
      scene.drawShape(shape)
   }
}

scene.start()
