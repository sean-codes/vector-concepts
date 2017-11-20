var scene = new Scene(document.querySelector('canvas'))
var circle = new Circle(scene.width/2, scene.height/2, 50)
var line = new Line(scene.width/2, scene.height/2, scene.width/2, scene.height/2)
var circleSin = new Circle(0, 0, 5)
var circleCos = new Circle(0, 0, 5)
scene.addShape(circle)
scene.addShape(circleSin)
scene.addShape(circleCos)
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

         console.log('Cosine: ' + mousedir.x + 'Sin: ' + mousedir.y)
         circleSin.points[0].x = mousedir.x*50 + this.width/2
         circleSin.points[0].y = this.height/2

         circleCos.points[0].x = this.width/2
         circleCos.points[0].y = mousedir.y*50 + this.height/2

         this.ctx.font = '14px Monospace'
         this.ctx.fillText('Sin: ' + mousedir.x, 20, 20)
         this.ctx.fillText('Cos: ' + mousedir.y, 20, 40)
      }
      scene.drawShape(shape)
   }
}

// Startup!
scene.start()
