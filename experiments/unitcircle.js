var colorRed = '#F22'
var colorGreen = '#465'
var colorGrey = '#999'

var scene = new Scene(document.querySelector('canvas'))
var vCenter = new Vector(scene.width/2, scene.height/2)
var circleUnit = new Circle(vCenter.x, vCenter.y, 50)
var circleSin = new Circle(vCenter.x, vCenter.y, 3)
circleSin.colorFill = colorRed
var circleCos = new Circle(vCenter.x, vCenter.y, 3)
circleCos.colorFill = colorGreen

scene.addShape(circleUnit)
scene.addShape(circleSin)
scene.addShape(circleCos)

scene.step = function(){
   scene.clear()
   for(var shape of scene.shapes){
      scene.drawShape(shape)
   }
   var mouseDir = this.mousepos.clone().min(vCenter).normalize()
   var mouseDirDegree = mouseDir.direction()

   // Move Sin/Cos
   circleSin.points[0].x = mouseDir.x * 50 + vCenter.x
   circleCos.points[0].y = mouseDir.y * 50 + vCenter.y

   // Draw angle
   this.ctx.beginPath()
   this.ctx.arc(vCenter.x, vCenter.y, 30, 0, mouseDirDegree / (180/Math.PI), false)
   this.ctx.stroke()

   // Draw line
   this.ctx.beginPath()
   this.ctx.lineTo(vCenter.x, vCenter.y)
   this.ctx.lineTo(mouseDir.x*50+ vCenter.x, mouseDir.y*50 + vCenter.y)
   this.ctx.stroke()

   // Info
   this.ctx.font = '16px Monospace'
   this.ctx.fillText('cos: ' + Math.round(mouseDir.x*1000)/1000, 10, 20)
   this.ctx.fillText('sin: ' + Math.round(mouseDir.y*1000)/1000, 10, 40)
   this.ctx.fillText('dir: ' + Math.round(mouseDirDegree*1000)/1000, 10, 60)
}

// Startup!
scene.start()
