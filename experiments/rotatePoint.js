var scene = new Scene(document.querySelector('canvas'))
var circle = new Circle(scene.width/2, scene.height/2, 10)
var circleGhost = new Circle(scene.width/2, scene.height/2, 10)
var gravity = new Circle(scene.width/2 + 50, scene.height/2, 5)
var angle = 0
var vCenter = new Vector(scene.width/2, scene.height/2)
gravity.colorFill = '#D44'
circle.colorFill = '#4a7'

scene.addShape(circle)
scene.addShape(circleGhost)
scene.addShape(gravity)

scene.step = function(){
   scene.clear()
   angle += 3
   if(angle == 360){ angle = 1 }
   if(scene.mouse.down){
      scene.keys[32]
         ? vCenter.copy(scene.mouse.pos)
         : gravity.points[0].copy(scene.mouse.pos)
   }
   var radius = gravity.points[0].distance(vCenter)
   circle.points[0].x = Math.cos(angle * Math.PI/180) * radius + gravity.points[0].x
   circle.points[0].y = Math.sin(angle * Math.PI/180) * radius + gravity.points[0].y
   circleGhost.points[0].copy(vCenter )
   for(var shape of scene.shapes){
      scene.drawShape(shape)
   }

   scene.ctx.fillStyle = '#000'
   scene.ctx.fillText('Click to move origin', 10, 20)
   scene.ctx.fillText('Hold Space and click to move circle start', 10, 35)

}

scene.start()
