import ShapePreview from '@/components/ShapePreview';
import { useProgress } from '@/context/ProgressContext';
import { shapeLevels } from '@/utils/puzzles';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isShapeUnlocked, isShapeComplete, resetProgress } = useProgress();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Shapes</Text>
        <Pressable style={styles.resetButton} onPress={resetProgress}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </Pressable>
      </View>
      <View style={styles.grid}>
        {shapeLevels.map((shape) => {
          const unlocked = isShapeUnlocked(shape.sides);
          const complete = isShapeComplete(shape.sides);

          return (
            <Pressable
              key={shape.sides}
              style={[styles.card, !unlocked && styles.cardLocked]}
              disabled={!unlocked}
              onPress={() => router.push(`/shapes/${shape.sides}`)}
            >
              <Text style={styles.name}>{shape.name.toUpperCase()}</Text>
              <ShapePreview
                sides={shape.sides}
                color={unlocked ? '#a78bfa' : '#666'}
              />
              {!unlocked && <Text style={styles.status}>Locked</Text>}
              {unlocked && complete && <Text style={styles.status}>Complete</Text>}
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
    paddingTop: 60,
    paddingBottom: 36,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  resetButton: {
    backgroundColor: '#3b3b3b',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  card: {
    width: '48%',
    backgroundColor: '#333',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  cardLocked: {
    opacity: 0.5,
  },
  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  status: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
});
