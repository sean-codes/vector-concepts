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

   shrink(amount) {
      this.x /= amount
      this.y /= amount
      return this
   }

   dot(vect) {
      return this.x * vect.x + this.y * vect.y
   }

   cdot(vect) {
      return this.x * vect.y - vect.x * this.y
   }

	det(vect) {
		return this.x * vect.x - this.y * vect.y
	}

   cross() {
      var save = this.x
      this.x = this.y
      this.y = save*-1
      return this
   }

   unit() {
      return this.clone().scale(1/this.length())
   }

   length() {
      return Math.sqrt(this.x*this.x + this.y*this.y)
   }

   distance(vect) {
      return this.clone().min(vect).length()
   }

   project(vect) {
      return this.unit().scale(this.unit().dot(vect))
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

   toString() {
      return '(' + Math.round(this.x*1000)/1000 + ', ' + Math.round(this.y*1000)/1000 + ')'
   }


}
