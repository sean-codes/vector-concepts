var scene = new Scene(canvas)

for (var i = 0; i < 10; i++) {
   var circle = new Circle(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      10
   )

   circle.vel = new Vector(
      Math.random() * 5 - 2.5,
      Math.random() * 5 - 2.5
   )

   scene.addShape(circle)
}

scene.step = function() {
   var speed = 0

   for (var c0 of scene.shapes) {
      speed += c0.vel.length()
      scene.drawShape(c0)
      c0.move(c0.vel)
      var c0Pos = c0.center()

      // keep inside
      if (c0Pos.x < 0 || c0Pos.x > canvas.width) {
         c0Pos.x -= c0Pos.x < 0 ? c0Pos : c0Pos.x - canvas.width
         c0.vel.x *= -1
      }

      if (c0Pos.y < 0 || c0Pos.y > canvas.height) {
         c0Pos.y -= c0Pos.y < 0 ? c0Pos : c0Pos.y - canvas.height
         c0.vel.y *= -1
      }

      // check for collisions
      for (var c1 of scene.shapes) {
         if (c0.id == c1.id) continue

         var c1Pos = c1.center()
         var distance = c0Pos.distance(c1Pos)
         var touchDistance = c0.radius + c1.radius

         // if collision we need to resolve
         if (touchDistance > distance) {
            var dir = c0Pos.direction(c1Pos)

            // first split them up
            var push = (touchDistance - distance) / 2
            c0.move(dir.clone().scale(-push))
            c1.move(dir.clone().scale(push))

            // then figure out how to bounce em
            var tan = new Vector(-dir.y, dir.x)

            // E = effect. read: c0 effect on c0 / c0 effect on c1
            // FOR MEMORY: odst: other direction - self tangnet
            var c0Ec0 = tan.clone().scale(c0.vel.dot(tan))
            var c0Ec1 = dir.clone().scale(c0.vel.dot(dir))

            var c1Ec0 = dir.clone().scale(c1.vel.dot(dir))
            var c1Ec1 = tan.clone().scale(c1.vel.dot(tan))

            // combine the effects
            c0.vel = c0Ec0.add(c1Ec0).clone()
            c1.vel = c0Ec1.add(c1Ec1).clone()
         }
      }
   }

   // interesting. this should seem to be unstable since the total is not staying
   // the same between collisions. after running this sped up for several hours
   // the system always seems to maintain and not go out of balance!! :]
   scene.debug('total speed: ' + Math.round(speed * 10) / 10)
}
