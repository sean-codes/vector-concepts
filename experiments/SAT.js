var scene = new Scene()

var vCenter = new Vector(scene.width/2, scene.height/2)
var boxes = [
   new Square(vCenter.x, vCenter.y, 50),
   new Square(vCenter.x+75, vCenter.y, 50)
]

scene.addShape(boxes[0])
scene.addShape(boxes[1])


scene.step = function(){
   scene.drawShapes()


   var noTouch = sat()
   for(var box of boxes){
      box.colorStroke = noTouch ? '#000' : '#F22';
   }

   if(scene.mouse.down) {
      scene.keys[32]
         ? boxes[0].setPos(scene.mouse.pos)
         : boxes[1].setPos(scene.mouse.pos)
   }
   //scene.stop()
}


function sat() {
   var noTouch = 0
   // Get the unique axis
   testPos = new Vector(vCenter.x, vCenter.y)
   boxes[0].rotate(1)

   // Stop hard coding
   // var axisArr = [
   //    new Vector(1, 0),
   //    new Vector(0, 1)
   // ]

   // Gather all the axis
   var axisArr = boxes[0].axis().concat(boxes[1].axis())

   // Loop
   for(var axis of axisArr) {
      var minMaxPairs = []
      for(var box of boxes) {
         var min = undefined
         var max = undefined
         for(var point of box.points) {
            var dot = axis.dot(point)
            min = min ? Math.min(min, dot) : dot
            max = max ? Math.max(max, dot) : dot
            scene.ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)'
            scene.drawLine(point, axis.project(point))
         }
         minMaxPairs.push({ min: min, max: max })
      }
      //console.log(minMaxPairs)
      if(minMaxPairs[0].min > minMaxPairs[1].max || minMaxPairs[1].min > minMaxPairs[0].max){
         //console.log('not touching on axis: ' + axis.toString())
         noTouch++
      }

   }
   return noTouch > 0
}
