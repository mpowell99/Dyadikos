import { useProgress } from '@/context/ProgressContext';
import {
    getPuzzleCountForSides,
    getPuzzlesForSides,
    getShapeName,
} from '@/utils/puzzles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ShapePuzzlesScreen() {
  const { sides } = useLocalSearchParams<{ sides: string }>();
  const router = useRouter();
  const { isShapeUnlocked, isPuzzleUnlocked, isPuzzleComplete } = useProgress();

  const parsedSides = Number(sides);

  if (Number.isNaN(parsedSides)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Invalid shape.</Text>
      </View>
    );
  }

  const unlocked = isShapeUnlocked(parsedSides);
  const shapeName = getShapeName(parsedSides);
  const puzzleCount = getPuzzleCountForSides(parsedSides);
  const puzzles = getPuzzlesForSides(parsedSides);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{shapeName}</Text>
      <Text style={styles.subtitle}>{puzzleCount} Puzzles</Text>

      {!unlocked && <Text style={styles.lockedText}>Complete previous shape to unlock.</Text>}

      <View style={styles.grid}>
        {puzzles.map((puzzle) => {
          const puzzleUnlocked = isPuzzleUnlocked(parsedSides, puzzle.puzzleNumber);
          const complete = isPuzzleComplete(puzzle.id);

          return (
            <Pressable
              key={puzzle.id}
              style={[styles.puzzleCard, !puzzleUnlocked && styles.puzzleCardLocked]}
              disabled={!puzzleUnlocked}
              onPress={() => router.push(`/puzzle/${parsedSides}/${puzzle.puzzleNumber}`)}
            >
              <Text style={styles.puzzleLabel}>Puzzle {puzzle.puzzleNumber}</Text>
              <Text style={styles.puzzleGoal}>Goal {puzzle.goalNumber}</Text>
              {!puzzleUnlocked && <Text style={styles.puzzleStatus}>Locked</Text>}
              {puzzleUnlocked && complete && <Text style={styles.puzzleStatus}>Complete</Text>}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 28,
  },
  centered: {
    flex: 1,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 2,
    marginBottom: 16,
  },
  lockedText: {
    color: '#fca5a5',
    marginBottom: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  puzzleCard: {
    width: '48%',
    backgroundColor: '#333',
    borderRadius: 10,
    borderColor: '#444',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  puzzleCardLocked: {
    opacity: 0.45,
  },
  puzzleLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  puzzleGoal: {
    color: '#ddd',
    marginTop: 4,
  },
  puzzleStatus: {
    color: '#fff',
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
  },
});
