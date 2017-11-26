# vector-concepts
> This is a repository I use to adventure, explore, and understand geometry / vector mathmatics.

![Example GIF](https://raw.githubusercontent.com/sean-codes/vector-concepts/master/example.gif?v=2)

View Experiments: [Experiments](https://sean-codes.github.io/vector-concepts/)
## ⚔️ Gear
- Vector.js - 2D Vector Math
- Scene.js - Holds the scene for drawing and handling input events
- Shape.js - Constructor for storing shape points and how to draw each

## 🗺 Explored
- Scene setup / Loop
- Unit Circle
- SIN/COS/TAN
- Basic Vector Setup ( Adding, Subtracting, Scale, Distance )
- Rotation
- Dot Product
- Projection
- Axis Aligned Bounding Box Collision
- Separate Axis Collisions

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

#### Cartesian vs Polar Coordinates
If you use the x- and y-coordinates, you are using Cartesian coordinates. If you use the angle and length of the vector, you are using polar coordinates.

Getting the X/Y coordiantes from length and angle ( Converting Polar to Cartesian )
``` js
    // To get the x and y cordinate of length and angle
    var x = length * Math.cos(angle / (180/Math.PI))
    var y = length * Math.sin(angle / (180/Math.PI))
```

### Sin, Cos, Tan are ratios
When thinking about sin, cos, tan it can be intuitive to think of the unit circle and solve a triangle using the ratios

```
sin: From -1 to 1 the Y
cos: From -1 to 1 the X
tan: can go above 1. the heigth of the wall
```

### DOT Product

The most mystical equation
```js
   dot = vector1.x * vector2.x + vector1.y * vector2.y
```

The dot product gives us a relationship of two vectors. It is useful for finding the angle

### Finding the angle between two vectors using DOT Product

The angle is equal to the DOT product of the vectors devided by their lengths multiplied



```js
   //COS(Angle) = DOT(V1, V2) / (V1.length * V2.length)
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
