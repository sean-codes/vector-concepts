var scene = new Scene(document.querySelector('canvas'))
var vCenter = new Vector(scene.width/2, scene.height/2)

var block0 = new Square(vCenter.x, vCenter.y, 50)
var block1 = new Square(vCenter.x - 100, vCenter.y, 50)

scene.addShape(block0)
scene.addShape(block1)

scene.step = function() {
   scene.clear()
   scene.drawShapes()

   if(scene.mouse.down){
      block0.setPos(scene.mouse.pos.clone().min(new Vector(25, 25)))
   }

   // Get the centers and width
   var center0 = block0.center()
   var center1 = block1.center()
   var halfWidth = block0.width/2
   var distance = center0.x - center1.x

   // Draw line
   this.ctx.beginPath()
   this.ctx.moveTo(center0.x, center0.y)
   this.ctx.lineTo(center1.x, center1.y)
   this.ctx.stroke()


   // Draw some info
   scene.ctx.fillStyle = '#000'
   scene.ctx.fillText(`center0 x: ${center0.x} y: ${center0.y}`, 20, 20)
   scene.ctx.fillText(`center1 x: ${center1.x} y: ${center1.y}`, 20, 35)
   scene.ctx.fillText(`distance ${distance}`, 20, 50)
   scene.ctx.fillText(`half width: ${halfWidth}`, 20, 65)
   scene.ctx.fillText(`projection: ${center0.unit().dot(center1.unit())}`, 20, 80)
}
