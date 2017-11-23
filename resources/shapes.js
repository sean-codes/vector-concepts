class Shape {
   constructor(){
      this.points = []
      this.direction = 0
      this.sides = []
		this.colorFill = 'transparent'
		this.colorStroke = '#000'
      this.center = new Vector(0, 0)
   }

   setPos(vect){
      this.pos = vect
      return this
   }

   setDirection(vect){
      this.direction = vect
      return this
   }

   move() {
      for(var point of this.points) {
         point.add(this.direction)
      }
   }

   reverse() {

   }

   rotate(angle, origin) {
      for(var point of this.points){
         var newAngle = point.clone().min(origin).direction() + angle
         var radius = point.distance(origin)
         point.x = Math.cos(newAngle * Math.PI/180) * radius + origin.x
         point.y = Math.sin(newAngle * Math.PI/180) * radius + origin.y
      }
   }

   draw(ctx) {
      ctx.beginPath()
      // Line to each side
      for(var point of this.points){
         ctx.lineTo(point.x, point.y)
      }

      ctx.closePath()

		ctx.fillStyle = this.colorFill
		ctx.fill()
		ctx.strokeStyle = this.colorStroke
      ctx.stroke()
   }
}

class Line extends Shape {
   constructor(x, y, x2, y2){
      super()

      this.points = [
         new Vector(x, y),
         new Vector(x2, y2)
      ]
   }
}

class Square extends Shape {
   constructor(x, y, size){
      super()

      this.width = size
      this.height = size

      this.points = [
         new Vector(x, y),
         new Vector(x+this.width, y),
         new Vector(x+this.width, y+this.height),
         new Vector(x, y+this.height)
      ]
   }
}

class Triangle extends Shape {
   constructor(x, y, width, height) {
      super()
      this.width = width
      this.height = height
      this.points = [
         new Vector(x, y-height/2),
         new Vector(x-width/2, y+height/2),
         new Vector(x+width/2, y+height/2)
      ]

      console.log(this.points)
   }
}
class Circle extends Shape{
   constructor(x, y, radius) {
      super()
      this.radius = radius
      this.points = [
         new Vector(x, y)
      ]
   }

   move() {
      this.pos.add(this.direction)
   }

   draw(ctx) {
      ctx.beginPath()
      ctx.arc(this.points[0].x, this.points[0].y, this.radius, 0, 2*Math.PI);

		ctx.fillStyle = this.colorFill
		ctx.fill()

		ctx.strokeStyle = this.colorStroke
      ctx.stroke()
   }
}
