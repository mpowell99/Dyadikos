export type Puzzle = {
  id: string;
  sides: number;
  puzzleNumber: number;
  goalNumber: number;
  description?: string;
};

export type ShapeLevel = {
  sides: number;
  name: string;
};

export const shapeLevels: ShapeLevel[] = [
  { sides: 4, name: 'Square' },
  { sides: 5, name: 'Pentagon' },
  { sides: 6, name: 'Hexagon' },
  { sides: 7, name: 'Heptagon' },
  { sides: 8, name: 'Octagon' },
  { sides: 9, name: 'Nonagon' },
  { sides: 10, name: 'Decagon' },
  { sides: 11, name: 'Hendecagon' },
  { sides: 12, name: 'Dodecagon' },
];

export function getBinarySpotsForSides(sides: number): number {
  return Math.floor(sides / 2);
}

export function getPuzzleCountForSides(sides: number): number {
  const spots = getBinarySpotsForSides(sides);
  return Math.max(0, Math.pow(2, spots) - 1);
}

export function getShapeName(sides: number): string {
  return shapeLevels.find((shape) => shape.sides === sides)?.name ?? `${sides}-gon`;
}

export function getPuzzlesForSides(sides: number): Puzzle[] {
  const count = getPuzzleCountForSides(sides);
  const width = getBinarySpotsForSides(sides);

  return Array.from({ length: count }, (_, index) => {
    const puzzleNumber = index + 1;

    return {
      id: `${sides}-${String(puzzleNumber).padStart(3, '0')}`,
      sides,
      puzzleNumber,
      goalNumber: puzzleNumber,
      description: `Binary: ${puzzleNumber.toString(2).padStart(width, '0')}`,
    };
  });
}

export function getPuzzleBySidesAndNumber(
  sides: number,
  puzzleNumber: number
): Puzzle | undefined {
  return getPuzzlesForSides(sides).find((puzzle) => puzzle.puzzleNumber === puzzleNumber);
}

export const puzzles: Puzzle[] = shapeLevels.flatMap((shape) =>
  getPuzzlesForSides(shape.sides)
);

export function getPuzzleById(id: string): Puzzle | undefined {
  return puzzles.find((p) => p.id === id);
}

export function getPuzzleByIndex(index: number): Puzzle | undefined {
  return puzzles[index];
}

export function getTotalPuzzles(): number {
  return puzzles.length;
}
