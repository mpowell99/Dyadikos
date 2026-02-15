import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

type Props = {
  goalNumber: number;
  currentBinary: string;
  currentDecimal: number;
  isSuccess: boolean;
};

export default function PuzzleHeader({
  goalNumber,
  currentBinary,
  currentDecimal,
  isSuccess,
}: Props) {
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (isSuccess) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.5, { duration: 600 })
        ),
        -1,
        true
      );
    }
  }, [isSuccess, glowOpacity]);

  const goalBoxAnimatedStyle = useAnimatedStyle(() => ({
    opacity: isSuccess ? 0.5 + glowOpacity.value * 0.5 : 1,
  }));

  return (
    <View style={styles.container}>
      {/* Goal Box */}
      <Animated.View style={[styles.section, goalBoxAnimatedStyle]}>
        <View
          style={[
            styles.goalBox,
            isSuccess && styles.goalBoxSuccess,
          ]}
        >
          <Text style={styles.goalLabel}>Goal</Text>
          <Text style={styles.goalValue}>{goalNumber}</Text>
          {isSuccess && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </Animated.View>

      {/* Binary Display */}
      <View style={styles.section}>
        <Text style={styles.label}>Binary</Text>
        <Text style={styles.binaryText}>{currentBinary}</Text>
      </View>

      {/* Decimal Display */}
      <View style={styles.section}>
        <Text style={styles.label}>Current</Text>
        <Text style={styles.decimalText}>{currentDecimal}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '25%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#262626',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  section: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalBox: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#3b3b3b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#555',
    position: 'relative',
  },
  goalBoxSuccess: {
    backgroundColor: '#22c55e',
    borderColor: '#16a34a',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 20,
  },
  goalLabel: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  goalValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  binaryText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Courier New',
    letterSpacing: 2,
  },
  decimalText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
