const colorSin = '#5D9'
const colorCos = '#D45'
const colorBorder = '#999'
const colorBackground = '#222'
const canvas = document.querySelector('canvas')
canvas.style.background = colorBackground
var scene = new Scene(canvas)
var line = new Line(scene.width/2, scene.height/2, scene.width/2+50, scene.height/2)
var unitCircle = new Circle(scene.width/2, scene.height/2, 50)
var circleSin = new Circle(0, 0, 5)
var circleCos = new Circle(0, 0, 5)
line.colorStroke = colorBorder
unitCircle.colorStroke = colorBorder
circleSin.colorFill = colorSin
circleCos.colorFill = colorCos

scene.addShape(unitCircle)
scene.addShape(circleSin)
scene.addShape(circleCos)
scene.addShape(line)

scene.step = function(){
   scene.clear()
   for(var shape of scene.shapes){
      scene.drawShape(shape)
   }

	// Get the angle between horizontal line and center - mousepos
	var horizontal = new Vector(1, 0)
	var vertical = new Vector(0, 1)
	var center = new Vector(this.width/2, this.height/2)
	var mousedir = this.mousepos.clone().min(center).normalize()
	var direction = mousedir.direction()

   this.ctx.beginPath()
   this.ctx.strokeStyle = '#999';
   this.ctx.arc(center.x, center.y, 30, 0, -direction/(180/Math.PI), true)
   this.ctx.stroke()
	// Move points around
	circleSin.points[0].x = mousedir.x*50 + this.width/2
	circleSin.points[0].y = this.height/2

	circleCos.points[0].x = this.width/2
	circleCos.points[0].y = mousedir.y*50 + this.height/2

	this.ctx.font = '14px Monospace'
	this.ctx.fillStyle = colorSin
	this.ctx.fillText('Cos: ' + Math.round(mousedir.x*1000)/1000, 10, 20)
	this.ctx.fillStyle = colorCos
	this.ctx.fillText('Sin: ' + Math.round(mousedir.y*1000)/1000, 10, 40)
	this.ctx.fillStyle = '#999'
	this.ctx.fillText('Dir: ' + Math.round(direction*1000)/1000, 10, 60)
   this.ctx.beginPath()
   this.ctx.moveTo(center.x, center.y)
   this.ctx.lineTo(mousedir.x*50 + center.x, mousedir.y*50+center.y)
   this.ctx.fillStyle = '#999'
   this.ctx.closePath()
   this.ctx.stroke()
}

// Startup!
scene.start()
