var scene = new Scene(document.querySelector('canvas'))
var circle = new Circle(scene.width/2, scene.height/2, 50)
var line = new Line(scene.width/2, scene.height/2, scene.width/2, scene.height/2)
scene.addShape(circle)
scene.addShape(line)

scene.step = function(){
   scene.clear()

   for(var shape of scene.shapes){

      if(shape.constructor.name == 'Line') {
         // Get the angle between horizontal line and center - mousepos
         var horizontal = new Vector(1, 0)
         var vertical = new Vector(0, 1)
         var center = new Vector(this.width/2, this.height/2)
         var mousedir = this.mousepos.clone().min(center).normalize()

         console.log(Math.cos(mousedir), Math.sin(mousedir))

      }
      scene.drawShape(shape)
   }
}

// Startup!
scene.start()
