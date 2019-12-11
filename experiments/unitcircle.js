var colorRed = '#F22'
var colorGreen = '#465'
var colorBlue = '#45B'
var colorGrey = '#999'
var colorBlack = '#111'

var scene = new Scene(document.querySelector('canvas'))
var vCenter = new Vector(scene.width/2, scene.height/2)
var circleUnit = new Circle(vCenter.x, vCenter.y, 50)
var circleSin = new Circle(vCenter.x, vCenter.y, 3)
var circleCos = new Circle(vCenter.x, vCenter.y, 3)
var circleTan = new Circle(vCenter.x, vCenter.y, 3)
var circleCTan = new Circle(vCenter.x, vCenter.y, 3)
circleTan.colorFill = colorBlue
circleCos.colorFill = colorRed
circleSin.colorFill = colorGreen

scene.addShape(circleUnit)
scene.addShape(circleSin)
scene.addShape(circleCos)
scene.addShape(circleTan)
scene.addShape(circleCTan)

scene.step = function(){
   scene.clear()
   for(var shape of scene.shapes){
      scene.drawShape(shape)
   }
   var mouseDir = this.mouse.pos.clone().min(vCenter).unit()
   var mouseDirDegree = mouseDir.angle()

   // Move Sin/Cos
   circleSin.points[0].y = mouseDir.y * 50 + vCenter.y
   circleCos.points[0].x = mouseDir.x * 50 + vCenter.x

   // Move Tan
   circleTan.points[0].x = 50 + vCenter.x
   circleTan.points[0].y = Math.tan(mouseDirDegree / (180/Math.PI)) * 50 + vCenter.y
   // Move CTan
   circleCTan.points[0].x = (1/Math.tan(mouseDirDegree / (180/Math.PI))) * 50 + vCenter.x
   circleCTan.points[0].y = 50 + vCenter.y
   // Draw angle
   this.ctx.beginPath()
   this.ctx.arc(vCenter.x, vCenter.y, 30, 0, mouseDirDegree / (180/Math.PI), false)
   this.ctx.stroke()

   // Draw line
   this.ctx.beginPath()
   this.ctx.lineTo(vCenter.x, vCenter.y)
   this.ctx.lineTo(mouseDir.x*50+ vCenter.x, mouseDir.y*50 + vCenter.y)
   this.ctx.stroke()

   this.ctx.beginPath()
   this.ctx.lineTo(vCenter.x, vCenter.y)
   this.ctx.lineTo(vCenter.x + 50, vCenter.y)
   this.ctx.stroke()

   // Info
   this.ctx.font = '16px Monospace'
	this.ctx.fillStyle = colorBlack
   this.ctx.fillText('cos: ' + Math.round(mouseDir.x*1000)/1000, 10, 20)
   this.ctx.fillText('sin: ' + Math.round(mouseDir.y*1000)/1000, 10, 40)
   this.ctx.fillText('tan: ' + Math.round(Math.tan(mouseDirDegree / (180/Math.PI))*1000)/1000, 10, 60)
   this.ctx.fillText('ctan: ' + Math.round(-1/Math.tan(mouseDirDegree / (180/Math.PI))*1000)/1000, 10, 80)
   this.ctx.fillText('dir: ' + Math.round(mouseDirDegree*1000)/1000, 10, 100)
}

// Startup!
scene.start()
