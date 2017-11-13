class Scene {
   constructor(canvas) {
      this.canvas = canvas
      this.ctx = this.canvas.getContext('2d')
      this.speed = 1000/60
      this.interval = undefined
      this.shapes = []
   }

   create(){}

   step(){}

   start(){
      this.create()
      this.interval = setInterval(this.step, this.speed)
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
      this.ctx.beginPath()
      for(var side of shape.sides){
         //console.log(side.p1)
         this.ctx.moveTo(side.p1.x, side.p1.y)
         this.ctx.lineTo(side.p2.x, side.p2.y)
      }
      this.ctx.stroke()
   }
}
