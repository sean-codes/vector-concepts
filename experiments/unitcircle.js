var scene = new Scene(document.querySelector('canvas'))

// Create and Step event
scene.create = function(){
   var point = new Circle(this.width/2, this.height/2)
}

scene.step = function(){
   scene.clear()

   for(var shape of scene.shapes){
      scene.drawShape(shape)
   }
}

// Startup!
scene.start()
