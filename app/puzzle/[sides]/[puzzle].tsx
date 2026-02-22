import PolygonCanvas from '@/components/PolygonCanvas';
import PuzzleHeader from '@/components/PuzzleHeader';
import { useProgress } from '@/context/ProgressContext';
import { calculateCurrentValue, hasReachedGoal } from '@/utils/binaryLogic';
import type { Line } from '@/utils/geometry';
import { getPuzzleBySidesAndNumber, getPuzzleCountForSides } from '@/utils/puzzles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function PuzzlePlayScreen() {
  const { sides, puzzle } = useLocalSearchParams<{ sides: string; puzzle: string }>();
  const router = useRouter();
  const { isPuzzleUnlocked, markPuzzleComplete } = useProgress();

  const parsedSides = Number(sides);
  const parsedPuzzleNumber = Number(puzzle);

  const puzzleData = useMemo(() => {
    if (Number.isNaN(parsedSides) || Number.isNaN(parsedPuzzleNumber)) return undefined;
    return getPuzzleBySidesAndNumber(parsedSides, parsedPuzzleNumber);
  }, [parsedSides, parsedPuzzleNumber]);

  const [drawnLines, setDrawnLines] = useState<Line[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!puzzleData) {
    return (
      <View style={styles.containerCentered}>
        <Text style={styles.infoText}>Puzzle not found.</Text>
      </View>
    );
  }

  const unlocked = isPuzzleUnlocked(parsedSides, parsedPuzzleNumber);

  if (!unlocked) {
    return (
      <View style={styles.containerCentered}>
        <Text style={styles.infoText}>This puzzle is locked.</Text>
      </View>
    );
  }

  const handleLineComplete = (from: number, to: number) => {
    const newLine: Line = { from, to };

    const lineExists = drawnLines.some(
      (line) =>
        (line.from === from && line.to === to) ||
        (line.from === to && line.to === from)
    );

    if (lineExists || isSuccess) {
      return;
    }

    const updatedLines = [...drawnLines, newLine];
    setDrawnLines(updatedLines);

    if (hasReachedGoal(updatedLines, puzzleData.goalNumber, puzzleData.sides)) {
      setIsSuccess(true);
      markPuzzleComplete(puzzleData.id);
    }
  };

  const handleNextPuzzle = () => {
    const totalForShape = getPuzzleCountForSides(parsedSides);
    const nextPuzzle = parsedPuzzleNumber + 1;

    if (nextPuzzle <= totalForShape) {
      router.replace(`/puzzle/${parsedSides}/${nextPuzzle}`);
      return;
    }

    router.replace(`/shapes/${parsedSides}`);
  };

  const { binary, decimal } = calculateCurrentValue(drawnLines, puzzleData.sides);

  return (
    <View style={styles.container}>
      <PuzzleHeader
        goalNumber={puzzleData.goalNumber}
        currentBinary={binary}
        currentDecimal={decimal}
        isSuccess={isSuccess}
      />
      <PolygonCanvas
        sides={puzzleData.sides}
        drawnLines={drawnLines}
        onLineComplete={handleLineComplete}
        isSuccess={isSuccess}
      />
      {isSuccess && (
        <Pressable style={styles.nextButton} onPress={handleNextPuzzle}>
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
  containerCentered: {
    flex: 1,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
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
});
