var canvas = document.querySelector('canvas')
var scene = new Scene(canvas)

var vCenter = new Vector(scene.width/2, scene.height/2)
var angle = 0
var radius = 50

while(angle < 360){
   angle += 36

   var x = Math.cos(angle * Math.PI/180) * radius
   var y = Math.sin(angle * Math.PI/180) * radius

   scene.addShape(new Circle(x + vCenter.x, y + vCenter.y, 3))
}

scene.step = function() {
   for(var shape of this.shapes) {
      scene.drawShape(shape)
   }
}

scene.start()
