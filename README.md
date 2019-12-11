# vector-concepts
> A repository I use to adventure, explore, and understand geometry / vector mathematics.

![Example GIF](https://raw.githubusercontent.com/sean-codes/vector-concepts/master/example.gif?v=2)

View Experiments: [click here](https://sean-codes.github.io/vector-concepts/)

## 🗺 Explored
- Scene setup / Loop
- Unit Circle
- SIN/COS/TAN
- Basic Vector Math ( Adding, Subtracting, Scale, Distance )
- Rotation
- Dot Product
- Projection with Dot Product
- Axis Aligned Bounding Box Collision (AABB)
- Separate Axis Collisions (SAT)

## 📙 Journal

#### Radians
Half of a circle = 180deg or `Math.PI` radians. A entire circle is 360deg or `Math.PI*2` radians. That is 6.28 radians in a circle. In a unit circle the circumference if equal to Math.PI*2

Radian to Degree

```js
   var deg = rad * 180/Math.PI
```

Degree to Radian
```js
   var rad = deg * Math.PI/180
```

### Sin, Cos, Tan are ratios
When thinking about sin, cos, tan it can be intuitive to think of the unit circle and solve a triangle using the ratios

```
sin: From -1 to 1 the Y
cos: From -1 to 1 the X
tan: can go above 1. the heigth of the wall
```

#### Cartesian vs Polar
**Cartesian**: using x/y to define a position

**Polar**: Using angle and length to define a position

##### Polar to Cartesian conversion. angle and length to (x, y):
``` js
 var x = length * Math.cos(angle)
 var y = length * Math.sin(angle)
```

### DOT Product

The most mystical equation
```js
var dot = vector1.x * vector2.x + vector1.y * vector2.y
```

The dot product gives us a relationship of two vectors. It is useful for finding the angle

##### Finding the angle between two vectors using DOT Product

The angle is equal to the DOT product of the vectors divided by their lengths multiplied

```js
// cos(Angle) = dot(V1, V2) / (v1.length * v2.length)
var dot = vector1.dot(vector2)
var cosAngle = dot / (vector1.length() * vector2.length())  // -1 to 1
var angle = acos(cosAngle) // 180 - 0
```


## 📚 Library
- http://blog.wolfire.com/2009/07/linear-algebra-for-game-developers-part-1/
- http://www.helixsoft.nl/articles/circle/sincos.htm
- https://www.khanacademy.org/math/trigonometry
- http://www-groups.dcs.st-and.ac.uk/history/HistTopics/Trigonometric_functions.html
- https://betterexplained.com/articles/intuitive-trigonometry/
