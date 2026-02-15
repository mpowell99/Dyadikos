import { Line, calculateDistance, getAllLinesForDistance } from './geometry';

/**
 * Convert a distance (1-4) to a binary bit position (0-3)
 * Distance 1 → bit 0 (2^0 = 1)
 * Distance 2 → bit 1 (2^1 = 2)
 * Distance 3 → bit 2 (2^2 = 4)
 * Distance 4 → bit 3 (2^3 = 8)
 */
export function distanceToBitPosition(distance: number): number {
  return distance - 1;
}

/**
 * Convert bit position to distance
 */
export function bitPositionToDistance(bit: number): number {
  return bit + 1;
}

/**
 * Check if all lines of a specific distance have been drawn
 */
export function isDistanceComplete(
  drawnLines: Line[],
  distance: number,
  totalPoints: number
): boolean {
  const maxDistance = Math.floor(totalPoints / 2);
  if (distance < 1 || distance > maxDistance) return false;

  // Get all possible lines for this distance
  const possibleLines = getAllLinesForDistance(totalPoints, distance);

  // Check if all possible lines have been drawn
  return possibleLines.every((possibleLine) =>
    drawnLines.some(
      (drawnLine) =>
        (drawnLine.from === possibleLine.from &&
          drawnLine.to === possibleLine.to) ||
        (drawnLine.from === possibleLine.to &&
          drawnLine.to === possibleLine.from)
    )
  );
}

/**
 * Get all distances that are complete
 */
export function getCompleteBitPositions(
  drawnLines: Line[],
  totalPoints: number
): number[] {
  const maxDistance = Math.floor(totalPoints / 2);
  const completeBits: number[] = [];

  for (let distance = 1; distance <= maxDistance; distance++) {
    if (isDistanceComplete(drawnLines, distance, totalPoints)) {
      completeBits.push(distanceToBitPosition(distance));
    }
  }

  return completeBits.sort((a, b) => a - b);
}

/**
 * Check if a specific drawn line is part of a completed distance
 */
export function isLineComplete(
  line: Line,
  drawnLines: Line[],
  totalPoints: number
): boolean {
  const distance = calculateDistance(line.from, line.to, totalPoints);
  return isDistanceComplete(drawnLines, distance, totalPoints);
}

/**
 * Calculate the current binary value from drawn lines
 * Only counts COMPLETE distances (all lines of that distance drawn)
 * Returns both the binary string and decimal value
 */
export function calculateCurrentValue(
  drawnLines: Line[],
  totalPoints: number
): { binary: string; decimal: number } {
  const maxDistance = Math.floor(totalPoints / 2);
  const completeBitPositions = getCompleteBitPositions(drawnLines, totalPoints);

  // Build binary string from highest to lowest bit
  let binaryString = '';
  let decimalValue = 0;

  for (let i = maxDistance - 1; i >= 0; i--) {
    if (completeBitPositions.includes(i)) {
      binaryString += '1';
      decimalValue += Math.pow(2, i);
    } else {
      binaryString += '0';
    }
  }

  return {
    binary: binaryString || '0',
    decimal: decimalValue,
  };
}

/**
 * Check if the current drawn lines equal the goal number
 */
export function hasReachedGoal(
  drawnLines: Line[],
  goalNumber: number,
  totalPoints: number
): boolean {
  const { decimal } = calculateCurrentValue(drawnLines, totalPoints);
  return decimal === goalNumber;
}

/**
 * Get which distances/bits need to be drawn to reach the goal
 */
export function getRequiredDistances(
  goalNumber: number,
  totalPoints: number
): number[] {
  const maxDistance = Math.floor(totalPoints / 2);
  const requiredDistances: number[] = [];

  for (let i = 0; i < maxDistance; i++) {
    if ((goalNumber & (1 << i)) !== 0) {
      requiredDistances.push(bitPositionToDistance(i));
    }
  }

  return requiredDistances.sort((a, b) => a - b);
}

/**
 * Get binary representation of a number with fixed width
 */
export function getBinaryString(num: number, width: number): string {
  return num.toString(2).padStart(width, '0');
}
