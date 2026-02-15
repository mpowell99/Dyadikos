export type Point = {
  x: number;
  y: number;
  index: number;
};

export type Line = {
  from: number;
  to: number;
};

/**
 * Calculate points evenly distributed on a circle
 * @param sides - Number of points (e.g., 9 for nonagon)
 * @param radius - Radius of the circle
 * @param centerX - X coordinate of circle center
 * @param centerY - Y coordinate of circle center
 * @returns Array of Point objects with x, y, and index
 */
export function getPointsOnCircle(
  sides: number,
  radius: number,
  centerX: number,
  centerY: number
): Point[] {
  const points: Point[] = [];
  const angleSlice = (2 * Math.PI) / sides;

  for (let i = 0; i < sides; i++) {
    // Start at top (Math.PI / 2) and go clockwise
    const angle = Math.PI / 2 - i * angleSlice;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    points.push({
      x,
      y,
      index: i,
    });
  }

  return points;
}

/**
 * Calculate the distance between two points on a polygon
 * Distance is the minimum number of edges between them
 * @param pointA - First point index
 * @param pointB - Second point index
 * @param totalPoints - Total number of points in the polygon
 * @returns Distance (1 to totalPoints/2)
 */
export function calculateDistance(
  pointA: number,
  pointB: number,
  totalPoints: number
): number {
  // Normalize indices
  const a = Math.min(pointA, pointB);
  const b = Math.max(pointA, pointB);

  // Calculate both directions and take the shorter
  const directDistance = b - a;
  const wrapDistance = totalPoints - directDistance;

  return Math.min(directDistance, wrapDistance);
}

/**
 * Get all possible line pairs for a specific distance
 * @param totalPoints - Number of points in polygon
 * @param distance - The distance we want all pairs for
 * @returns Array of Line objects representing all lines of that distance
 */
export function getAllLinesForDistance(
  totalPoints: number,
  distance: number
): Line[] {
  const lines: Line[] = [];

  for (let i = 0; i < totalPoints; i++) {
    // For each point, find the two points at the target distance
    const pointA = i;
    const pointB = (i + distance) % totalPoints;

    // Only add each line once (avoid duplicates)
    if (pointA < pointB) {
      lines.push({ from: pointA, to: pointB });
    }
  }

  return lines;
}

/**
 * Check if two line definitions are the same (accounting for direction)
 */
export function linesAreEqual(line1: Line, line2: Line): boolean {
  return (
    (line1.from === line2.from && line1.to === line2.to) ||
    (line1.from === line2.to && line1.to === line2.from)
  );
}

/**
 * Get distance between a point and line segment
 * Used for hit detection on drawn lines
 */
export function pointToLineDistance(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const num = Math.abs(
    (y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1
  );
  const den = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
  return num / den;
}
