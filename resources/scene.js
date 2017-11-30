class Scene {
   constructor(canvas) {
      this.canvas = canvas
      if(!this.canvas){
         this.canvas = document.querySelector('canvas')
      }
      this.canvas.tabIndex = 1
      this.ctx = this.canvas.getContext('2d')

      this.width = this.canvas.width
      this.height = this.canvas.height
      this.speed = 1000/60
      this.interval = undefined
      this.shapes = []
      this.debugPos = new Vector(20, 0)

      this.mouse = {
         pos: new Vector(0, 0),
         down: false
      }

      this.listen()

      this.keys = {}
      this.start()
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
         e.preventDefault()
         this.keydown(e.keyCode)
      })

      this.canvas.addEventListener('keyup', (e) => {
         this.keyup(e.keyCode)
      })
   }

   step(){}

   start(){
      this.interval = setInterval(() => {
         this.debugPos = this.debugPos.set(10, 0)
         this.clear()
         this.step()
      }, this.speed)
   }

   stop(){
      clearInterval(this.interval)
   }

   clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
   }

   addShapes(shapes){
      for(var shape of shapes){
         this.addShape(shape)
      }
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

   drawLine(v1, v2) {
      this.ctx.beginPath()
      this.ctx.moveTo(v1.x, v1.y)
      this.ctx.lineTo(v2.x, v2.y)
      this.ctx.stroke()
   }

   drawCircle(v, radius, color) {
      this.ctx.beginPath()
      this.ctx.arc(v.x, v.y, radius, 0, Math.PI*2)
      this.ctx.fillColor = color || 'transparent'
      this.ctx.fill()
      this.ctx.stroke()
   }

   debug(text, color){
      this.ctx.font = '16px Monospace'
      this.ctx.fillStyle = color || '#222'
      this.debugPos.add(new Vector(0, 18))
      this.ctx.fillText(text, this.debugPos.x, this.debugPos.y)
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
