class Vector {
   constructor(x, y) {
      this.x = x
      this.y = y
   }

   add(vect){
      this.x += vect.x
      this.y += vect.y
   }
   
   scale(amount){
      this.x *= amount
      this.y *= amount
   }

   reflect(){
      this.scale(-1)
   }
}
