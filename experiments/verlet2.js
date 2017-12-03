var scene = new Scene()

var set = {
   bounce: 0.95,
   gravity: new Vector(0, 0.5),
   friction: 0.97
}
var points = []
for(var i = 0; i < 11; i++){
   points.push(new Point(Math.random()*scene.width, Math.random()*100, '#F22'))
}

scene.step = function(){
   scene.clear()
   movePoints()
   drawPoints()
}
function Point(x, y, color){
   this.color = color
   this.pos = new Vector(x, y)
   this.old = this.pos.clone().min(new Vector(Math.random()*10-5, Math.random()*10-5))
}
