var scene = new Scene()

var line1 = new Line(200, 100, 300, 200)
var line2 = new Line(300, 100, 200, 200)

scene.addShape(line1)
scene.addShape(line2)
var circle = new Circle(0, 0, 3)
circle.colorFill = '#F22'
scene.addShape(circle)

scene.step = function() {
   scene.drawShapes()
	var ipoint = intersect(line1, line2)
	console.log(ipoint)
	if(ipoint) circle.setPos(ipoint)

	if(scene.mouse.down){
		line2.points[0].copy(scene.mouse.pos)
	}

	scene.debug('Hold mouse to move line')
}

// Slope intercept
function intersect(line1, line2) {
	line1.p1 = line1.points[0]
	line1.p2 = line1.points[1]
	line2.p1 = line2.points[0]
	line2.p2 = line2.points[1]
   //y = mx+b and then dance
   var s1 = (line1.p1.y - line1.p2.y) / (line1.p1.x - line1.p2.x)
   var s2 = (line2.p1.y - line2.p2.y) / (line2.p1.x - line2.p2.x)

	// Slops are the same
   if (s1 == s2) return undefined
   var b1 = -s1 * line1.p1.x + line1.p1.y
   var b2 = -s2 * line2.p1.x + line2.p1.y

   var x = (b2 - b1) / (s1 - s2)
   var y = s1 * x + b1
   return new Vector(x, y)
}
