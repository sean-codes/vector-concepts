var scene = new Scene(document.querySelector('canvas'))

// Create and Step event
scene.create = function(){
   var shape = new Square(0, 0, 20)
   shape.direction = new Vector(1, 1)
   this.addShape(shape)
}

scene.step = function(){
   scene.clear()

   for(var shape of scene.shapes){
      scene.drawShape(shape)

      shape.move()
      if(shape.pos.x + shape.width > scene.width || shape.pos.x < 0){
         // bounce
         shape.direction.x *= -1
      }
      if(shape.pos.y + shape.height > scene.height || shape.pos.y < 0){
         shape.direction.y *= -1
      }
   }
}

// Startup!
scene.start()
