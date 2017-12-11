class Shape {
   constructor(color){
      this.points = []
      this.direction = 0
		this.colorFill = color || 'transparent'
		this.colorStroke = color || '#000'
      this.unique = Math.random()
      this.type = 'Shape'
   }

   setPos(vect){
      var move = this.points[0].clone().min(vect)
      for(var point of this.points) {
         point.min(move)
      }
   }

   setDirection(vect){
      this.direction = vect
      return this
   }

   move(vect) {
      for(var point of this.points) {
         point.add(vect)
      }
   }
   back(vect) {
      for(var point of this.points) {
         point.min(vect)
      }
   }

   reverse() {

   }

   rotate(angle, origin) {
      origin = origin || this.center()
      for(var point of this.points) {
         // 1. Find the radius
         var radius = point.distance(origin)

         // 2. Find the new angle
         var newAngle = point.clone().min(origin).direction() + angle

         // 3. Set the new cartesian
         point.x = Math.cos(newAngle * Math.PI/180) * radius + origin.x
         point.y = Math.sin(newAngle * Math.PI/180) * radius + origin.y
      }
   }

   draw(ctx) {
      ctx.beginPath()
      // Line to each side
      for(var point of this.points){
         ctx.lineTo(point.x, point.y)
      }

      ctx.closePath()

		ctx.fillStyle = this.colorFill
		ctx.fill()
		ctx.strokeStyle = this.colorStroke
      ctx.stroke()
   }

   center(){
      var x = 0
      var y = 0
      for(var point of this.points){
         x += point.x
         y += point.y
      }
      return new Vector(x/this.points.length, y/this.points.length)
   }

   axis(){
      // Return each axis (as a unit)
      var axis = []
      for(var i = 0; i < this.points.length; i++){
         var point1 = this.points[i]
         var point2 = this.points[i-1] || this.points[this.points.length-1]
         axis.push({
            dir: point2.clone().min(point1).unit().cross(),
            points: [point1, point2],
            id: i,
            shape: this
         })
      }

      //return [new Vector(1, 0), new Vector(-1, 0)]
      return axis
   }

   // sides(){
   //    // A side is a set of points
   //    // Going top / right / bottom /left
   //    var sides = []
   //    for(var i = 0; i < this.points.length; i++){
   //       var p1 = this.points[i].clone()
   //       var p2 = this.points[i+1] ? this.points[i+1].clone() : this.points[0].clone()
   //       sides.push({
   //          points: [p1, p2],
   //          axis: p2.clone().min(p1).unit(),
   //          shape: this
   //       })
   //    }
   //    return sides
   // }
}

class Line extends Shape {
   constructor(x, y, x2, y2, color){
      super(color)
      this.type = 'Line'
      this.points = [
         new Vector(x, y),
         new Vector(x2, y2)
      ]
   }

   sides() {
      return [ [this.points[0].clone(), this.points[1].clone()] ]
   }
}

class Square extends Shape {
   constructor(x, y, width, height, color){
      super(color)
      this.type = 'Square'
      this.width = width
      this.height = height || width

      this.points = [
         new Vector(x+Math.random(), y+Math.random() ),
         new Vector(x+Math.random()+this.width, y+Math.random()),
         new Vector(x+Math.random()+this.width, y+this.height+Math.random()),
         new Vector(x+Math.random(), y+this.height+Math.random())
      ]
   }
   sides(){
      return [
         { points: [this.points[0], this.points[1]]},
         { points: [this.points[1], this.points[2]]},
         { points: [this.points[2], this.points[3]]},
         { points: [this.points[3], this.points[0]]}
      ]
   }
}

class Triangle extends Shape {
   constructor(x, y, width, height) {
      super()
      this.type = 'Triangle'
      this.width = width
      this.height = height || width
      this.points = [
         new Vector(x, y-this.height/2),
         new Vector(x-this.width/2, y+this.height/2),
         new Vector(x+this.width/2, y+this.height/2)
      ]
   }
}

class Circle extends Shape{
   constructor(x, y, radius) {
      super()
      this.type = 'Circle'
      this.radius = radius
      this.points = [
         new Vector(x, y)
      ]
   }

   draw(ctx) {
      ctx.beginPath()
      ctx.arc(this.points[0].x, this.points[0].y, this.radius, 0, 2*Math.PI);

		ctx.fillStyle = this.colorFill
		ctx.fill()

		ctx.strokeStyle = this.colorStroke
      ctx.stroke()
   }
}
