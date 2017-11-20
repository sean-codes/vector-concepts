class Shape {
   constructor(){
      this.points = []
      this.direction = new Vector(0, 0)
      this.sides = []
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

   rotate() {

   }

   draw(ctx) {
      ctx.beginPath()
      // Line to each side
      for(var point of this.points){
         ctx.lineTo(point.x, point.y)
      }

      ctx.closePath()
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
      ctx.stroke()
   }
}
