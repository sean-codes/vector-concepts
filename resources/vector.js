class Vector {
   constructor(x, y) {
      this.set(x, y)
   }
   copy(vect) {
      this.x = vect.x
      this.y = vect.y
   }

   set(x, y){
      this.setX(x)
      this.setY(y)
      return this
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

   distance(vect) {
      return this.clone().min(vect).length()
   }

   reflect() {
      this.scale(-1)
   }

   clone() {
      return new Vector(this.x, this.y)
   }

   direction() {
      return 180 + Math.atan2(this.y*-1, this.x*-1) * 180/Math.PI
   }
}
