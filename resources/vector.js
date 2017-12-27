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
      var save = this.x
      this.x = -this.y
      this.y = save
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

   reflect(vect) {
      var n = vect.unit()
      var dot = n.dot(this)
      return n.scale(dot*2).min(this)
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

   normal(vect) {
      return this.clone().min(vect).unit().cross()
   }

   closestOnLine(lineP1, lineP2) {
      var line = lineP2.clone().min(lineP1)
      var lineLength = line.length()
      var directionFromFirstPoint = this.clone().min(lineP1)

      // Project point on line
      var ratioOver = line.dot(directionFromFirstPoint)/lineLength/lineLength
      ratioOver = Math.min(ratioOver, 1)
      ratioOver = Math.max(ratioOver, 0)
      //return
      var closest = line.scale(ratioOver).add(lineP1)
      return closest
   }
}
