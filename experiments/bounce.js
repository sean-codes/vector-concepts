var scene = new Scene(document.querySelector('canvas'))

// Create and Step event
var square = new Square(0, 0, 20).setDirection(new Vector(1, 1))
scene.addShape(square)


scene.step = function(){
   scene.clear()

   for(var shape of scene.shapes){
      scene.drawShape(shape)

      shape.move()
      if(shape.points[0].x + shape.width > scene.width || shape.points[0].x < 0){
         // bounce
         shape.direction.x *= -1
      }
      if(shape.points[0].y + shape.height > scene.height || shape.points[0].y < 0){
         shape.direction.y *= -1
      }
   }
}

// Startup!
scene.start()
