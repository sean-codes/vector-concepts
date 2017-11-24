class Scene {
   constructor(canvas) {
      this.canvas = canvas
      this.canvas.tabIndex = 1
      this.ctx = this.canvas.getContext('2d')
      this.width = this.canvas.width
      this.height = this.canvas.height
      this.speed = 1000/60
      this.interval = undefined
      this.shapes = []

      this.mouse = {
         pos: new Vector(0, 0),
         down: false
      }

      this.listen()

      this.keys = {}
   }

   listen(){
      this.canvas.addEventListener('mousemove', (e) => {
         this.mousemove(e.layerX, e.layerY)
      })

      this.canvas.addEventListener('mousedown', (e) => {
         this.mousedown()
      })

      this.canvas.addEventListener('mouseup', (e) => {
         this.mouseup()
      })

      this.canvas.addEventListener('keydown', (e) => {
         this.keydown(e.keyCode)
      })

      this.canvas.addEventListener('keyup', (e) => {
         this.keyup(e.keyCode)
      })
   }

   step(){}

   start(){
      this.interval = setInterval(() => {
         this.step()
      }, this.speed)
   }

   stop(){
      clearInterval(this.interval)
   }

   clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
   }

   addShape(shape) {
      this.shapes.push(shape)
   }

   drawShapes() {
      for(var shape of this.shapes){
         this.drawShape(shape)
      }
   }

   drawShape(shape) {
      shape.draw(this.ctx)
   }

   mousemove(x, y) {
      this.mouse.pos.setX(x)
      this.mouse.pos.setY(y)
   }

   mousedown() {
      this.mouse.down = true
   }

   mouseup(){

      this.mouse.down = false
   }

   keydown(code){
      this.keys[code] = true
   }

   keyup(code){
      this.keys[code] = false
   }
}
