var scene = new Scene()

var line1 = new Line(100, 100, 300, 200)
var line2 = new Line(100, 200, 200, 200)

scene.addShape(line1)
scene.addShape(line2)
var circle = new Circle(0, 0, 3)
circle.colorFill = '#F22'
scene.addShape(circle)

scene.step = function() {
   scene.drawShapes()
	var ipoint = intersect(line1.points[0], line1.points[1], line2.points[0], line2.points[1])
	circle.setPos(ipoint || new Vector(-10, -10))

	if(scene.mouse.down){
		scene.keys[32]
         ? line2.points[1].copy(scene.mouse.pos)
         :  line2.points[0].copy(scene.mouse.pos)
	}
   scene.debug('Hold mouse down to move line')
   scene.debug('Hold space to move other side' )
}

function intersect(Start1, End1, Start2, End2) {
	// [Operation] - Trying to figure out how to find point of intersection of two lines
	//---------------------------------------------------------------------------------------------------
	// Equation of a line
	// Line = StartPoint + (EndPoint - StartPoint) * T
	// Line = StartPoint + Direction * T
	// T is a ratio from 0 - 1. 0 = StartPoint and 1 = EndPoint. > 0 and < 1 is everything in between

	// You can find out if a line intersects if they equal each other
	// StartPoint1 + Direction1 * T1 == StartPoint2 + Direction2 * T2

	// This is parametric and will give us 2 equations
	// 1. Start1.x + Direction1.x * T1 == Start2.x + Direction2.y * T2
	// 2. Start1.y + Direction1.y * T1 == Start2.y + Direction2.y * T2

	// [Mission 1] We need to isolate T1 for both equations
	// 1. T1 = (Start2.x + Direction2.x * T2 - Start1.x)/Direction1.x
	// 1. T1 = (Start2.y + Direction2.y * T2 - Start1.y)/Direction1.y

	// Now we got rid of T1 lets rewrite this with only 1 unknown. Mister T2!
	// (Start2.x + Direction2.x * T2 - Start1.x)/Direction1.x == (Start2.y + Direction2.y * T2 - Start1.y)/Direction1.y

	// [Mission 2] We need to figure out how to calculate T2.
	// 1. Multiply the left side by Direction1.y
	// 2. Multiply the right side by Direction1.x
	// (Start2.x + Direction2.x * T2 - Start1.x) * Direction1.y == (Start2.y + Direction2.y * T2 - Start1.y) * Direction1.x

	// 3. Distribute! hint: THIS IS GOING TO GET SO SCAREY!!! :]
	// Start2.x*Direction1.y + Direction2.x*Direction1.y*T2 - Start1.x*Direction1.y == Start2.y*Direction1.x + Direction2.y*Direction1.x*T2 - Start1.y*Direction1.x

	// 4. This is where I tip over!! Move everything around so your T2 are on the same side
	// Direction2.x*Direction1.y*T2 - Direction2.y*Direction1.x*T2 == Start2.y*Direction1.x - Start1.y*Direction1.x - Start2.x*Direction1.y + Start1.x*Direction1.y

	// 5. On the left side we see that spooky T2 and be undistributed
	// T2(Direction2.x*Direction1.y - Direction2.y*Direction1.x) == Start2.y*Direction1.x - Start1.y*Direction1.x - Start2.x*Direction1.y + Start1.x*Direction1.y

	// 6. We made it! Move those others over. USE PARENTHESIS HERE!!!
	// T2 = (Start2.y*Direction1.x - Start1.y*Direction1.x - Start2.x*Direction1.y + Start1.x*Direction1.y)/(Direction2.x*Direction1.y - Direction2.y*Direction1.x)

	// [Mission 3] With T2 we can quickly get T1 :]
	// T1 = Start2.x + Direction2.x * T2 - Start1.x)/Direction.x

	// [Mission 4] If They are both within 0 to 1 the touch!
	// [Mission 5] Drop T1 or T2 one of the lines equation to get the point
	// intersectionX = Start1.x + Direction.x * T1
	// intersectionY = Start1.y + Direction.y * T1

	// To actually code this we start with getting the directions
	var Direction1 = {
		x: End1.x - Start1.x,
		y: End1.y - Start1.y
	}
	var Direction2 = {
		x: End2.x - Start2.x,
		y: End2.y - Start2.y
	}

	// Use the math we created.
	var T2 = (Start2.y*Direction1.x - Start1.y*Direction1.x - Start2.x*Direction1.y + Start1.x*Direction1.y)/(Direction2.x*Direction1.y - Direction2.y*Direction1.x)
	var T1 = (Start2.x + Direction2.x * T2 - Start1.x)/Direction1.x

	if(T2 < 0 || T2 > 1 || T1 < 0 || T1 > 1){ return false }
	return new Vector(
		Start1.x + Direction1.x * T1,
		Start1.y + Direction1.y * T1
	)
}
