const sinColor = '#5D9'
const cosColor = '#D45'
const canvas = document.querySelector('canvas')
canvas.style.background = '#222'
var scene = new Scene(canvas)
var line = new Line(scene.width/2, scene.height/2, scene.width/2+50, scene.height/2)
var unitCircle = new Circle(scene.width/2, scene.height/2, 50)
var circleSin = new Circle(0, 0, 5)
var circleCos = new Circle(0, 0, 5)
line.colorStroke = '#999'
unitCircle.colorStroke = '#999'
circleSin.colorFill = sinColor
circleCos.colorFill = cosColor

scene.addShape(unitCircle)
scene.addShape(circleSin)
scene.addShape(circleCos)
//scene.addShape(line)

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

	circleSin.points[0].x = mousedir.x*50 + this.width/2
	circleSin.points[0].y = this.height/2

	circleCos.points[0].x = this.width/2
	circleCos.points[0].y = mousedir.y*50 + this.height/2

	this.ctx.font = '14px Monospace'
	this.ctx.fillStyle = '#222'
	this.ctx.fillRect(0, 0, 275, 50)
	this.ctx.fillStyle = '#D45'
	this.ctx.fillText('Sin: ' + mousedir.x, 20, 20)
	this.ctx.fillStyle = '#5D9'
	this.ctx.fillText('Cos: ' + mousedir.y, 20, 40)
}

// Startup!
scene.start()
