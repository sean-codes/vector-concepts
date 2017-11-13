class Polygon {
   constructor(x, y){
      this.pos = new Vector(x, y)
      this.sides = []
   }

   move(vect) {
      for(var side of this.sides) {
         side.p1.add(vect)
         side.p2.add(vect)
      }
   }

   rotate() {

   }
}

class Square extends Polygon {
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

class Triangle extends Polygon {

}
