class Vector {
   constructor(x, y) {
      this.setX(x)
      this.setY(y)
   }

   setX(x) {
      this.x = x
   }

   setY(y) {
      this.y = y
   }

   add(vect) {
      this.x += vect.x
      this.y += vect.y
      return this
   }

   min(vect) {
      this.x -= vect.x
      this.y -= vect.y
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

	det(vect) {
		return this.x * vect.x - this.y * vect.y
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

   direction() {
      return 180 + Math.atan2(this.y, this.x*-1) * 180/Math.PI
   }
}
