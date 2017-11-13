var scene = new Scene(document.querySelector('canvas'))

// Create and Step event
scene.create = function(){
   this.addShape(new Square(5, 0, 15))
}

scene.step = function(){
   scene.clear()
   
   for(var shape of scene.shapes){
      scene.drawShape(shape)
   }
}

// Startup!
scene.start()
