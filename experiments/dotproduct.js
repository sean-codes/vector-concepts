var scene = new Scene()

var origin = new Vector(scene.width/2, scene.height*.75)
var v1 = new Vector(scene.width/2 + 50, scene.height*.75)

scene.step = function() {
   scene.debugLine(origin, v1, '#222')
   scene.debugLine(origin, scene.mouse.pos, '#444')

   var tempV1 = v1.clone().min(origin)
   var tempV2 = scene.mouse.pos.clone().min(origin)

   scene.debug(`Origin: ${origin.toString()}`)
   scene.debug(`V1: ${tempV1.toString()}`)
   scene.debug(`V2: ${tempV2.toString()}`)

   var dot = tempV2.dot(tempV1)
   var dot2 = tempV2.unit().dot(tempV1)
   var scaleOfBothVectorLengths = tempV1.length()*tempV2.length()
   scene.debug(`DOT: ${dot}`)
   scene.debug(`DOT Unit: ${dot2}`)
   scene.debug(`Length of Both: ${dot}`)
   scene.debug(`~Length of Both: ${Math.round(scaleOfBothVectorLengths)}`)
   scene.debug(`COS: ${dot/scaleOfBothVectorLengths}`)
   scene.debug(`Angle: ${Math.acos(dot/scaleOfBothVectorLengths) * 180/Math.PI}`)

}
