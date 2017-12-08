var scene = new Scene()
var vCenter = new Vector(scene.width/2, scene.height/2)

scene.step = function(){
   v1 = new Vector(25, 0)
   v2 = scene.mouse.pos.clone().min(vCenter)

   scene.debug('V1: ' + v1)
   scene.debug('V2: ' + v2)

   scene.debugLine(vCenter, vCenter.clone().add(v1), '#000')
   scene.debugLine(vCenter, vCenter.clone().add(v2), '#000')

   scene.debug('V2 Projected on V1: ' + v1.clone().project(v2).toString())
   scene.debugLine(vCenter, v1.clone().project(v2).add(vCenter), '#F22')

   scene.debug('V1 Projected on V2: ' + v2.clone().project(v1).toString())
   scene.debugLine(vCenter, v2.clone().project(v1).add(vCenter),'#465')

   scene.debug(v1.unit().scale(v1.unit().dot(v2)))
}
