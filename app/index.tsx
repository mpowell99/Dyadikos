import PolygonCanvas from '@/components/PolygonCanvas';
import PuzzleHeader from '@/components/PuzzleHeader';
import { calculateCurrentValue, hasReachedGoal } from '@/utils/binaryLogic';
import type { Line } from '@/utils/geometry';
import { getPuzzleByIndex, getTotalPuzzles } from '@/utils/puzzles';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [drawnLines, setDrawnLines] = useState<Line[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const puzzle = getPuzzleByIndex(currentPuzzleIndex);

  if (!puzzle) {
    return (
      <View style={styles.container}>
        <Text style={styles.completeText}>Game Complete!</Text>
      </View>
    );
  }

  const handleLineComplete = (from: number, to: number) => {
    const newLine: Line = { from, to };

    // Check if this line already exists
    const lineExists = drawnLines.some(
      (line) =>
        (line.from === from && line.to === to) ||
        (line.from === to && line.to === from)
    );

    if (lineExists) {
      return; // Don't add duplicate lines
    }

    const updatedLines = [...drawnLines, newLine];
    setDrawnLines(updatedLines);

    // Check if puzzle is solved
    if (hasReachedGoal(updatedLines, puzzle.goalNumber, puzzle.sides)) {
      setIsSuccess(true);
    }
  };

  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < getTotalPuzzles() - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      setDrawnLines([]);
      setIsSuccess(false);
    }
  };

  const { binary, decimal } = calculateCurrentValue(drawnLines, puzzle.sides);

  return (
    <View style={styles.container}>
      <PuzzleHeader
        goalNumber={puzzle.goalNumber}
        currentBinary={binary}
        currentDecimal={decimal}
        isSuccess={isSuccess}
      />
      <PolygonCanvas
        sides={puzzle.sides}
        drawnLines={drawnLines}
        onLineComplete={handleLineComplete}
        isSuccess={isSuccess}
      />
      {isSuccess && (
        <Pressable
          style={styles.nextButton}
          onPress={handleNextPuzzle}
        >
          <Text style={styles.nextArrow}>→</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextArrow: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  completeText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },

});