import { isLineComplete } from '@/utils/binaryLogic';
import type { Line } from '@/utils/geometry';
import { getPointsOnCircle, Point } from '@/utils/geometry';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';
import Svg, { Circle, G, Line as SvgLine } from 'react-native-svg';

type Props = {
  sides: number;
  drawnLines: Line[];
  onLineComplete: (from: number, to: number) => void;
  isSuccess: boolean;
};

export default function PolygonCanvas({
  sides,
  drawnLines,
  onLineComplete,
  isSuccess,
}: Props) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [points, setPoints] = useState<Point[]>([]);
  const [draggedFrom, setDraggedFrom] = useState<number | null>(null);
  const [dragTo, setDragTo] = useState({ x: 0, y: 0 });
  const [pressedPointIndex, setPressedPointIndex] = useState<number | null>(
    null
  );

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });

    const radius = Math.min(width, height) * 0.3;
    const centerX = width / 2;
    const centerY = height / 2;
    const calculatedPoints = getPointsOnCircle(
      sides,
      radius,
      centerX,
      centerY
    );
    setPoints(calculatedPoints);
  };

  const createPointGesture = (pointIndex: number, startPoint: Point) => {
    return Gesture.Pan()
      .onStart(() => {
        'worklet';
        if (isSuccess) return;

        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        runOnJS(setPressedPointIndex)(pointIndex);
        runOnJS(setDraggedFrom)(pointIndex);
        runOnJS(setDragTo)({ x: startPoint.x, y: startPoint.y });
      })
      .onUpdate((event) => {
        'worklet';
        if (draggedFrom !== null) {
          const absoluteX = startPoint.x + event.translationX;
          const absoluteY = startPoint.y + event.translationY;
          runOnJS(setDragTo)({ x: absoluteX, y: absoluteY });
        }
      })
      .onFinalize(() => {
        'worklet';
        runOnJS(setPressedPointIndex)(null);

        if (draggedFrom === null) return;

        const tolerance = 60;
        let releasedOnPoint: number | null = null;

        points.forEach((point) => {
          const distance = Math.sqrt(
            (point.x - dragTo.x) ** 2 + (point.y - dragTo.y) ** 2
          );
          if (distance < tolerance && point.index !== draggedFrom) {
            releasedOnPoint = point.index;
          }
        });

        if (releasedOnPoint !== null) {
          runOnJS(onLineComplete)(draggedFrom, releasedOnPoint);
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        }

        runOnJS(setDraggedFrom)(null);
        runOnJS(setDragTo)({ x: 0, y: 0 });
      });
  };

  if (points.length === 0) {
    return <View style={styles.container} onLayout={handleContainerLayout} />;
  }

  const svgWidth = containerSize.width;
  const svgHeight = containerSize.height;

  return (
    <View
      style={styles.container}
      onLayout={handleContainerLayout}
    >
      <Svg width={svgWidth} height={svgHeight} style={styles.svg} pointerEvents="none">
        <G>
          {/* Draw completed lines */}
          {drawnLines.map((line, idx) => {
            const fromPoint = points.find((p) => p.index === line.from);
            const toPoint = points.find((p) => p.index === line.to);

            if (!fromPoint || !toPoint) return null;

            const isComplete = isLineComplete(line, drawnLines, sides);
            const lineColor = isComplete ? '#a78bfa' : '#888';

            return (
              <SvgLine
                key={`line-${idx}`}
                x1={fromPoint.x}
                y1={fromPoint.y}
                x2={toPoint.x}
                y2={toPoint.y}
                stroke={lineColor}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={isComplete ? 1 : 0.4}
              />
            );
          })}

          {/* Draw preview line while dragging */}
          {draggedFrom !== null && (
            <SvgLine
              x1={points[draggedFrom].x}
              y1={points[draggedFrom].y}
              x2={dragTo.x}
              y2={dragTo.y}
              stroke="#000"
              strokeWidth={2}
              strokeDasharray="5,5"
              strokeLinecap="round"
              opacity={0.7}
            />
          )}

          {/* Draw points */}
          {points.map((point) => (
            <G key={`point-${point.index}`}>
              <Circle
                cx={point.x}
                cy={point.y}
                r={8}
                fill="#fff"
                opacity={0.9}
              />
              <Circle
                cx={point.x}
                cy={point.y}
                r={pressedPointIndex === point.index ? 12 : 4}
                fill="#a78bfa"
              />
            </G>
          ))}
        </G>
      </Svg>

      {/* Touch targets for points */}
      {points.map((point) => (
        <GestureDetector
          key={`gesture-${point.index}`}
          gesture={createPointGesture(point.index, point)}
        >
          <Animated.View
            style={{
              position: 'absolute',
              width: 70,
              height: 70,
              borderRadius: 35,
              left: point.x - 35,
              top: point.y - 35,
            }}
          />
        </GestureDetector>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
});
