# 0.3.3

- Improves arc effects on near-overlaps.
- Sets a minimum angle to correct double-connected boxes. This still isn't exactly right, but it's an improvement!
- Improves perfect center overlap handling.

# 0.3.2

- Improves start point when not colliding.

# 0.3.1

- Updates dependencies.

# 0.3.0

- Updates box to box arrow function. The arc of an arrow is now calculated based on its proximity as well as its angle. The start and end positions are smarter, allowing for better overlap handling. Edge cases (especially around corner end points) are fixed. Ever-more perfect arrows!

# 0.2.2

- Fixes default `padStart` for box to box arrows.

# 0.2.1

- Adds box to box algorithm.

# 0.2.0

- Removes classes (Point / Line) in favor of a more minimal utility functions.
- Refactors `getArrow` function.
- Optimizes arrow-head angles.
- Adds start angle, center angle to list of returned values.

# 0.1.0

- Hello world!
- Just the point-to-point algorithm for now.
