import { getPointsOnCircle } from '@/utils/geometry';
import { StyleSheet, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

type Props = {
  sides: number;
  size?: number;
  color?: string;
};

export default function ShapePreview({
  sides,
  size = 96,
  color = '#a78bfa',
}: Props) {
  const center = size / 2;
  const radius = size * 0.36;
  const points = getPointsOnCircle(sides, radius, center, center)
    .map((point) => `${point.x},${point.y}`)
    .join(' ');

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Polygon
          points={points}
          fill="transparent"
          stroke={color}
          strokeWidth={2.5}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
