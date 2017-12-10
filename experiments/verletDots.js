var scene = new Scene()

var set = {
   bounce: 0.5,
   gravity: new Vector(0, 0.25),
   friction: 0.975
}
var points = []
for(var i = 0; i < 200; i++){
   setTimeout(function(){
      points.push(new Point(Math.random()*scene.width, Math.random()*100, scene.randomColor()))
   }, i*100)
}

scene.step = function(){
   movePoints()
   collidePoints()
   drawPoints()

   var mouseDir = scene.mouse.pos.clone().min(scene.center)
   var distance = mouseDir.distance(scene.center.clone().min(scene.mouse.pos))
   set.gravity = mouseDir.unit().scale(0.2*(Math.min(1, distance/300)))
}

function movePoints(){
   for(var point of points) {
      var vel = point.pos.clone().min(point.old).scale(set.friction)
      point.old = point.pos.clone()
      point.pos.add(vel).add(set.gravity)

      if(point.pos.x > scene.width || point.pos.x < 0){
         point.pos.setX(point.pos.x < 0 ? 0 : scene.width)
         point.old.setX(point.pos.x + vel.x * set.bounce)
      }

      if(point.pos.y > scene.height || point.pos.y < 0){
         point.pos.setY(point.pos.y < 0 ? 0 : scene.height)
         point.old.setY(point.pos.y + vel.y * set.bounce)
      }
   }
}

function collidePoints(){
   for(var point1 of points){
      for(var point2 of points){
         if(point1 == point2) continue
         var distance = point1.pos.distance(point2.pos)
         //console.log(point1Vel.dot(point2Vel))
         if(distance < point1.radius*2){
            var collideDirection = point1.pos.clone().min(point2.pos).unit().scale(point1.radius*2-distance)
            //console.log(collideDirection)
            point1.old.min(collideDirection.scale(set.bounce/4))
         }
      }
   }
}

function drawPoints(){
   for(var point of points){
      scene.debugCircle(point.pos, point.radius, point.color)
   }
}

function Point(x, y, color){
   this.color = color
   this.radius = 10
   this.pos = new Vector(x, y)
   this.old = this.pos.clone().min(new Vector(Math.random()*10-5, Math.random()*10-5))
}
