# vector-concepts
> This is a repository I use to adventure, explore, and understand geometry / vector mathmatics.

![Example GIF](https://raw.githubusercontent.com/sean-codes/vector-concepts/master/example.gif?v=2)

## Objects
- Vector.js - 2D Vector Math
- Scene.js - Holds the scene for drawing and handling input events
- Shape.js - Constructor for storing shape points and how to draw each

## Explored
- Scene setup / Loop
- Basic Vector Setup ( Adding, Subtracting, Scale, Distance )
- Dot Product

## Notes

#### Cartesian vs Polar Coordinates
If you use the x- and y-coordinates, you are using Cartesian coordinates. If you use the angle and length of the vector, you are using polar coordinates.

Getting the X/Y coordiantes from Polar
``` js
    // To get the x and y cordinate of length and angle
    var x = radius * Math.cos(angle / (180/Math.PI))
    var y = radius * Math.sin(angle / (180/Math.PI))
```
## Additional Resources
- http://blog.wolfire.com/2009/07/linear-algebra-for-game-developers-part-1/
- http://www.helixsoft.nl/articles/circle/sincos.htm
- https://www.khanacademy.org/math/trigonometry
- http://www-groups.dcs.st-and.ac.uk/history/HistTopics/Trigonometric_functions.html
