class Scene {
   constructor(canvas) {
      this.canvas = canvas
      this.ctx = this.canvas.getContext('2d')
      this.width = this.canvas.width
      this.height = this.canvas.height
      this.speed = 1000/60
      this.interval = undefined
      this.shapes = []

      this.mousepos = new Vector(0, 0)
      this.listen()
   }

   listen(){
      this.canvas.addEventListener('mousemove', (e) => {
         this.mousemove(e.layerX, e.layerY)
      })
   }

   step(){}

   start(){
      this.interval = setInterval(() => { this.step() }, this.speed)
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

   drawShape(shape) {
      shape.draw(this.ctx)
   }

   mousemove(x, y) {
      this.mousepos.setX(x)
      this.mousepos.setY(y)
   }
}
