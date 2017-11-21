var canvas = document.querySelector('canvas')
var scene = new Scene(canvas)

var vCenter = new Vector(scene.width/2, scene.height/2)
var radius = 50
var angle = 0
var angleStep = 10
// Generate a circle
while(angle < 360){
   angle += angleStep

   // To get the x and y cordinate of length and angle
   var x = radius * Math.cos(angle / (180/Math.PI))
   var y = radius * Math.sin(angle / (180/Math.PI))

   var newCircle = new Circle(scene.width/2 + x, scene.height/2 + y, 3)
   scene.addShape(newCircle)
}

scene.step = function() {
   for(var shape of this.shapes) {
      scene.drawShape(shape)
   }
}

scene.start()
