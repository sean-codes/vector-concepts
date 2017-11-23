class Shape {
   constructor(){
      this.points = []
      this.direction = new Vector(0, 0)
      this.sides = []
		this.colorFill = 'transparent'
		this.colorStroke = '#000'
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
         var vDiff = point.clone().min(origin)
         console.log(vDiff.length())
         point.x = origin.x * Math.cos(angle * Math.PI/180) - point.y * Math.sin(angle)
         point.y = origin.x * Math.sin(angle * Math.PI/180) - point.y * Math.cos(angle)
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
