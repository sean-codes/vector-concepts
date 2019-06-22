class Vector {
   constructor(x=0, y=0) {
      this.set(x, y)
   }

   copy(vect) {
      this.x = vect.x
      this.y = vect.y
   }

   clone() {
      return new Vector(this.x, this.y)
   }

   set(x, y){
      this.setX(x)
      this.setY(y)
      return this
   }

   setX(x) {
      this.x = x
      return this
   }

   setY(y) {
      this.y = y
      return this
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

   difference(vect) {
      return new Vector(this.x - vect.x, this.y - vect.y)
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
      return new Vector(-this.y, this.x)
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

   reflect(vect) {
      var n = vect.unit()
      var dot = n.dot(this)
      return n.scale(dot*2).min(this)
   }

   direction(v2) {
      return v2.clone().min(this).unit()
   }

   angle() {
      return 180 + Math.atan2(this.y*-1, this.x*-1) * 180/Math.PI
   }

   toString() {
      return '(' + Math.round(this.x*1000)/1000 + ', ' + Math.round(this.y*1000)/1000 + ')'
   }

   normal(vect) {
      return this.clone().min(vect).unit().cross()
   }

   addCartesian(dir, radius) {
      this.x += Math.cos(dir * Math.PI/180) * radius
      this.y += Math.sin(dir * Math.PI/180) * radius
      return this
   }
}
