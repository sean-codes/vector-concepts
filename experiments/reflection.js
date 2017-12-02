var scene = new Scene()
var line = new Line(scene.width/2-100, scene.height/2+50, scene.width/2+100, scene.height/20)
scene.addShape(line)

var laser = new Vector(100, 100)


scene.step = function() {
   scene.drawShapes()

   scene.drawLine(scene.mouse.pos, scene.mouse.pos.clone().add(laser), '#F22')
   var intersection = intersect(line.points[0], line.points[1], scene.mouse.pos, scene.mouse.pos.clone().add(laser))
   if(intersection){
      scene.drawCircle(intersection, 3, '#f22')
      //reflect the rest
      var over = scene.mouse.pos.clone().add(laser).min(intersection)
      scene.drawLine(intersection, intersection.clone().add(over), '#465')
      scene.debug(over)
      var reflect = over.reflect(line.points[1].clone().min(line.points[0]))
      scene.drawLine(intersection, intersection.clone().add(reflect))
   }
}

function intersect(Start1, End1, Start2, End2) {
   var Direction1 = { x: End1.x - Start1.x, y: End1.y - Start1.y }
   var Direction2 = { x: End2.x - Start2.x, y: End2.y - Start2.y }

   // Use the math we created.
   var T2 = (Start2.y*Direction1.x - Start1.y*Direction1.x - Start2.x*Direction1.y + Start1.x*Direction1.y)/(Direction2.x*Direction1.y - Direction2.y*Direction1.x)
   var T1 = Direction1.x
      ? (Start2.x + Direction2.x * T2 - Start1.x)/Direction1.x
      : (Start2.y + Direction2.y * T2 - Start1.y)/Direction1.y

   if(T2 < 0 || T2 > 1 || T1 < 0 || T1 > 1){ return false }
   return new Vector(
      Start1.x + Direction1.x * T1,
      Start1.y + Direction1.y * T1
   )
}
