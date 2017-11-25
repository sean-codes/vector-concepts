var scene = new Scene()

var origin = new Vector(scene.width/2, scene.height*.75)
var v1 = new Vector(scene.width/2 + 50, scene.height*.75)

scene.step = function() {
   scene.ctx.strokeStyle = '#222'
   scene.drawLine(origin, v1)
   scene.ctx.strokeStyle = '#444'
   scene.drawLine(origin, scene.mouse.pos)

   var tempV1 = v1.clone().min(origin)
   var tempV2 = scene.mouse.pos.clone().min(origin)

   scene.debug(`Origin: (${origin.x}, ${origin.y})`)
   scene.debug(`V1: (${tempV1.x}, ${tempV1.y})`)
   scene.debug(`V2: (${tempV2.x}, ${tempV2.y})`)

   var dot = tempV2.dot(tempV1)
   var scaleOfBothVectorLengths = tempV1.length()*tempV2.length()
   scene.debug(`DOT: ${dot}`)
   scene.debug(`Length of Both: ${dot}`)
   scene.debug(`~Length of Both: ${Math.round(scaleOfBothVectorLengths)}`)
   scene.debug(`Angle: ${dot/scaleOfBothVectorLengths}`)

}
