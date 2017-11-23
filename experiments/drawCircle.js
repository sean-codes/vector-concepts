var scene = new Scene(document.querySelector('canvas'))

// Polar
var radius = 50
var angle = 0

while(angle < 360){
   angle += 10
   
   // Convert Cartisian to Polar
   var x = Math.cos(angle * Math.PI/180) * radius
   var y = Math.sin(angle * Math.PI/180) * radius

   scene.addShape(new Circle(x+scene.width/2, y+scene.height/2, 3))
}

scene.step = function() {
   for(var shape of this.shapes){
      scene.drawShape(shape)
   }
}
scene.start()
