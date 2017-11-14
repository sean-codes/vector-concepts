class Shape {
   constructor(x, y){
      this.pos = new Vector(x, y)
      this.direction = new Vector(0, 0)
      this.sides = []
   }

   setPos(vect){
      this.pos = vect
   }

   move() {
      this.pos.add(this.direction)
      for(var side of this.sides) {
         side.p1.add(this.direction)
         side.p2.add(this.direction)
      }
   }

   reverse() {

   }

   rotate() {

   }
}

class Line extends Shape {
   constructor(x, y, x2, y2){
      super(x, y)

      this.sides = [
         { p1: new Vector(x, y), p2: new Vector(x2, y2) }
      ]
   }
}

class Square extends Shape {
   constructor(x, y, size){
      super(x, y)

      this.width = size
      this.height = size
      this.sides = [ // Top, Left, Bottom, Right
         { p1: new Vector(this.pos.x, this.pos.y), p2: new Vector(this.pos.x+this.width, this.pos.y) },
         { p1: new Vector(this.pos.x+this.width, this.pos.y), p2: new Vector(this.pos.x+this.width, this.pos.y+this.height) },
         { p1: new Vector(this.pos.x+this.width, this.pos.y+this.height), p2: new Vector(this.pos.x, this.pos.y + this.height) },
         { p1: new Vector(this.pos.x, this.pos.y+this.height), p2: new Vector(this.pos.x, this.pos.y) },
      ]
   }
}

class Triangle extends Shape {

}
