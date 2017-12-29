class Vertex {
   constructor(scene, pos) {
      this.scene = scene
      this.pos = pos.clone()
      this.old = pos.clone()
   }

   update() {
      var vel = velocity()
      this.old = this.pos.clone()
      this.pos = this.pos.add(vel)
   }

   draw(scene) {
      scene.drawCircle({v: this.pos, radius: 3, color: '#FFF' })
   }

   contain() {

   }

   velocity() {
      return this.pos.clone().min(this.old)
   }
}
