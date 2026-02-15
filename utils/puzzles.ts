export type Puzzle = {
  id: string;
  sides: number;
  goalNumber: number;
  description?: string;
};

/**
 * Puzzle progression: start with simple goals and increase difficulty
 * For a 9-sided polygon, max value is 15 (all 4 distances drawn)
 */
export const puzzles: Puzzle[] = [
  {
    id: 'nonagon-001',
    sides: 9,
    goalNumber: 7, // 0111 - draw distances 1, 2, 3
    description: 'Binary: 0111',
  },
  {
    id: 'nonagon-002',
    sides: 9,
    goalNumber: 11, // 1011 - draw distances 1, 2, 4
    description: 'Binary: 1011',
  },
  {
    id: 'nonagon-003',
    sides: 9,
    goalNumber: 13, // 1101 - draw distances 1, 3, 4
    description: 'Binary: 1101',
  },
];

export function getPuzzleById(id: string): Puzzle | undefined {
  return puzzles.find((p) => p.id === id);
}

export function getPuzzleByIndex(index: number): Puzzle | undefined {
  return puzzles[index];
}

export function getTotalPuzzles(): number {
  return puzzles.length;
}
