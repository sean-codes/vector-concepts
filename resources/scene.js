class Scene {
	//---------------------------------------------------------------------------
	// Setup
	//---------------------------------------------------------------------------
   constructor(canvas) {
      this.canvas = canvas
      if(!this.canvas){
         this.canvas = document.querySelector('canvas')
      }
      this.canvas.tabIndex = 1
		this.ctx = this.canvas.getContext('2d')
      this.ctx.lineWidth = 2
		this.width = this.canvas.width
		this.height = this.canvas.height
		this.speed = 1000/60
		this.interval = undefined

      this.shapes = []
      this.debugPos = new Vector(20, 0)
      this.center = new Vector(this.width/2, this.height/2)
      this.mouse = {
         pos: new Vector(0, 0),
         down: false,
			up: false
      }

      this.listen()

      this.keys = {}
      this.start()
		this.debugQueue = []
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

	//---------------------------------------------------------------------------
	// Loop
	//---------------------------------------------------------------------------
   step(){}
   start(){
      this.interval = setInterval(() => {
         this.loop()
      }, this.speed)
   }
   loop() {
      this.debugPos = this.debugPos.set(10, 0)
      this.clear()
      this.step()
      this.drawDebugList()
      this.mouse.up = false
   }

   stop(){
      clearInterval(this.interval)
   }

   clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
   }

   setSpeed(speed) {
      this.stop()
      this.speed = speed
      this.start()
   }

	//---------------------------------------------------------------------------
	// Shapes
	//---------------------------------------------------------------------------
   addShapes(shapes){
      for(var shape of shapes){
         this.addShape(shape)
      }
   }

   addShape(shape) {
      this.shapes.push(shape)
      this.shapes[this.shapes.length-1].id = this.shapes.length-1
   }

	//---------------------------------------------------------------------------
	// Observing
	//---------------------------------------------------------------------------
   debug(text, color){
      this.ctx.font = '16px Monospace'
      this.ctx.fillStyle = color || '#222'
      this.debugPos.add(new Vector(0, 18))
      this.ctx.fillText(text, this.debugPos.x, this.debugPos.y)
   }

	debugLine(v1, v2, color) {
		this.debugQueue.push({
			type: 'Line',
			v1: {x:v1.x, y:v1.y},
			v2: {x:v2.x, y:v2.y},
			color: color })
	}

	debugText(v, text, color) {
		this.debugQueue.push({
			type: 'Text',
			v: {x:v.x, y:v.y},
			text: text,
			color: color })
	}

	debugCircle(v, radius, color) {
		this.debugQueue.push({
			type: 'Circle',
			v: {x:v.x, y:v.y},
			radius: radius,
			color: color })
	}

	drawDebugList(){
		this.debugQueue = this.debugQueue.filter((draw) => {
			this[`draw${draw.type}`](draw)
		})
	}

	//---------------------------------------------------------------------------
	// Drawing
	//---------------------------------------------------------------------------
	drawLine(info) {
      this.ctx.strokeStyle = info.color || '#000'
      this.ctx.beginPath()
      this.ctx.moveTo(Math.floor(info.v1.x), Math.floor(info.v1.y))
      this.ctx.lineTo(Math.floor(info.v2.x), Math.floor(info.v2.y))
      this.ctx.stroke()
   }

   drawCircle(info) {
      this.ctx.beginPath()
      this.ctx.arc(info.v.x, info.v.y, info.radius, 0, Math.PI*2)
      this.ctx.fillStyle = info.color || 'transparent'
      this.ctx.strokeStyle = '#000'
      this.ctx.fill()
      this.ctx.stroke()
   }

   drawText(info) {
      this.ctx.fillStyle = info.color || '#000'
      this.ctx.fillText(info.text, info.v.x, info.v.y)
   }

	drawShapes() {
      for(var shape of this.shapes){
         this.drawShape(shape)
      }
   }

   drawShape(shape) {
      shape.draw(this.ctx)
   }

	//---------------------------------------------------------------------------
	// Inputs
	//---------------------------------------------------------------------------
   mousemove(x, y) {
      this.mouse.pos.setX(x)
      this.mouse.pos.setY(y)
   }

   mousedown() {
      this.mouse.down = true
   }

   mouseup(){
		this.mouse.up = true
      this.mouse.down = false
   }

   keydown(code){
      this.keys[code] = true
   }

   keyup(code){
      this.keys[code] = false
   }

	//---------------------------------------------------------------------------
	// Utility
	//---------------------------------------------------------------------------
   randomColor() {
      var r = Math.floor(Math.random()*50)
      var g = Math.floor(Math.random()*75)
      var b = Math.floor(Math.random()*175)

      return `rgb(${r}, ${g}, ${b})`
   }

   sides() {
      return [
         [ new Vector(0, 0), new Vector(0, scene.height) ],
         [ new Vector(0, scene.height), new Vector(scene.width, scene.height) ],
         [ new Vector(scene.width, scene.height), new Vector(scene.width, 0) ],
         [ new Vector(scene.width, 0), new Vector(0, 0) ],
      ]
   }
}
