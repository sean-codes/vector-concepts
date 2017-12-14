var scene = new Scene()
var settings = new Settings()
settings.add({ name: 'gravity', min: -1, max: 1, value: 0 })
settings.add({ name: 'friction', min: 0.9, max: 1, value: 0.999 })
settings.add({ name: 'bounce', min: 0, max: 1, value: 0.95 })

var body = new Body(scene.center(), 50, 10)
scene.step = function() {
   body.draw()
   body.move()
}

function Body(origin, radius, sideCount) {
   this.edges = []
   this.points = []
   var angleStep = 360/sideCount
   var old = origin.clone().add(new Vector(Math.cos(0)*radius, Math.sin(0)*radius))
   this.points.push(new Point(old))
   for(var i = 1; i <= sideCount; i++) {
      var x = Math.cos((angleStep*i) * Math.PI/180) * radius
      var y = Math.sin((angleStep*i) * Math.PI/180) * radius
      var pos = origin.clone().add(new Vector(x, y))
      var old = pos.clone()
      this.points.push(new Point(old))
   }

   for(var i = 0; i < this.points.length; i++) {
      var p1 = this.points[i]
      var p2 = this.points[i + 1 < this.points.length ? i + 1 : 0]
      this.edges.push(new Edge(p1, p2))
   }

   for(var i = 0; i < this.points.length; i+= 2) {
      var p1 = this.points[i]
      var p2 = this.points[i + 1 == this.points.length ? i : i + 1]
      console.log(p1, p2)
      //this.edges.push(new Edge(p1, p2))
   }
   //this.edges.push(new Edge(this.points[0], this.points[2]))

   this.draw = function() {
      for(var edge of this.edges){ edge.draw(); }
   }

   this.move = function() {
      for(var edge of this.edges) edge.move()
   }
}

function Edge(point1, point2) {
   this.points = [point1, point2]
   this.length = point1.pos.distance(point2.pos)
   console.log(this.length)
   this.contrain = function() {
      var difference = this.points[0].pos.difference(this.points[1].pos)
      var force = difference.length() - this.length

      var pull = difference.unit().scale(force)

      this.points[0].pos.min(pull.scale(0.5))
      this.points[1].pos.add(pull.scale(0.5))
   }

   this.move = function() {
      for(var point of this.points) point.move()
      this.contrain()
   }

   this.draw = function() {
      scene.debugLine(this.points[0].pos, this.points[1].pos, '#000')
      for(var point of this.points) point.draw()
   }
}

function Point(vector) {
   this.pos = vector.clone()
   this.old = vector.clone()

   this.move = function() {
      var velocity = this.velocity()
         .add(new Vector(0, settings.read('gravity')))
         .scale(settings.read('friction'))

      this.old = this.pos.clone()
      this.pos.add(velocity)

      this.contain()
   }

   this.contain = function() {
      var velocity = this.velocity()

      if(this.pos.x < 0 || this.pos.x > scene.width) {
         this.pos.x = this.pos.x < 0 ? 0 : scene.width
         this.old.x = this.pos.x + velocity.x * settings.read('bounce')
      }

      if(this.pos.y < 0 || this.pos.y > scene.height) {
         this.pos.y = this.pos.y < 0 ? 0 : scene.height
         this.old.y = this.pos.y + velocity.y * settings.read('bounce')
      }
   }

   this.draw = function() {
      scene.debugCircle(this.pos, 3, '#FFF')
   }

   this.velocity = function() {
      return this.pos.difference(this.old)
   }
}
