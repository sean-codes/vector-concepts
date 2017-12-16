var scene = new Scene()
var settings = new Settings()
settings.add({ name: 'sides', min: 2, max: 15, value: 5, step: 1 })
settings.add({ name: 'radius', min: 10, max: 60, value: 50 })
settings.add({ name: 'iterations', min: 1, max: 5, value: 3, step: 1 })
settings.add({ name: 'gravity', min: -1, max: 1, value: 0.05 })
settings.add({ name: 'friction', min: 0.9, max: 1, value: 0.99 })
settings.add({ name: 'bounce', min: 0, max: 1, value: 0.9 })
var body = new Body(scene.center(), 50, 20)
scene.step = function() {
   body.draw()
   body.move()

   if(settings.changed('sides') || settings.changed('radius')){
      body = new Body(scene.center(), settings.read('radius'), settings.read('sides'))
   }
}

function Body(origin, radius, sideCount) {
   this.draw = function() {
      for(var edge of this.edges) edge.draw()
   }

   this.move = function() {
      for(var point of this.points) point.move()
      for(var i = 0; i < settings.read('iterations'); i++) {
         for(var edge of this.edges) edge.contrain()
      }
   }


   this.center = function() {
      return this.points.reduce(function(sum, num) {
         return sum.add(num.pos)
      }, new Vector(0, 0)).scale(1/this.points.length)
   }


   this.edges = []
   this.points = []
   var angleStep = 360/sideCount
   var old = origin.clone().add(new Vector(Math.cos(0)*radius, Math.sin(0)*radius))
   this.points.push(new Point(old))
   for(var i = 1; i < sideCount; i++) {
      var x = Math.cos((angleStep*i) * Math.PI/180) * radius
      var y = Math.sin((angleStep*i) * Math.PI/180) * radius
      var pos = origin.clone().add(new Vector(x, y))
      var old = pos.clone()
      this.points.push(new Point(old))
   }

   for(var i = 0; i < this.points.length; i++) {
      var p1 = this.points[i]
      var p2 = this.points[i-1 < 0 ? this.points.length - 1 : i-1]
      this.edges.push(new Edge(p1, p2))
   }

   var center = this.center()
   this.points.push(new Point(center))
   var centerPoint = this.points[this.points.length-1]
   for(var i = 0; i < this.points.length-1; i++) {
      this.edges.push(new Edge(this.points[i], this.points[this.points.length-1]))
   }
}

function Edge(point1, point2) {
   this.points = [point1, point2]
   this.length = point1.pos.distance(point2.pos)

   this.contrain = function() {
      var direction = this.points[0].pos.clone().min(this.points[1].pos)
      var pull = (this.length - direction.length()) / 2
      this.points[0].pos.add(direction.unit().scale(pull/2))
      this.points[1].pos.min(direction.unit().scale(pull/2))
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
