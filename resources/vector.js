class Vector {
   constructor(x, y) {
      this.x = x
      this.y = y
   }

   add(vect) {
      this.x += vect.x
      this.y += vect.y
      return this
   }

   scale(amount) {
      this.x *= amount
      this.y *= amount
      return this
   }

   dot(vect) {
      return this.x * vect.x + this.y * vect.y
   }

   cross() {

   }

   normalize() {
      return this.scale(1/this.length())
   }

   length() {
      return Math.sqrt(this.x*this.x + this.y*this.y)
   }

   reflect() {
      this.scale(-1)
   }

   clone() {
      return new Vector(this.x, this.y)
   }
}
