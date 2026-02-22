import { getPuzzleCountForSides, shapeLevels } from '@/utils/puzzles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const PROGRESS_STORAGE_KEY = 'dyadikos-completed-puzzles-v1';

type ProgressContextValue = {
  completedPuzzleIds: Set<string>;
  markPuzzleComplete: (puzzleId: string) => void;
  resetProgress: () => void;
  isPuzzleComplete: (puzzleId: string) => boolean;
  isShapeUnlocked: (sides: number) => boolean;
  isPuzzleUnlocked: (sides: number, puzzleNumber: number) => boolean;
  isShapeComplete: (sides: number) => boolean;
};

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

function makePuzzleId(sides: number, puzzleNumber: number): string {
  return `${sides}-${String(puzzleNumber).padStart(3, '0')}`;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedPuzzleIds, setCompletedPuzzleIds] = useState<Set<string>>(new Set());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const rawValue = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);

        if (!rawValue) {
          setIsHydrated(true);
          return;
        }

        const parsedValue = JSON.parse(rawValue) as string[];
        if (Array.isArray(parsedValue)) {
          setCompletedPuzzleIds(new Set(parsedValue));
        }
      } catch {
      } finally {
        setIsHydrated(true);
      }
    };

    loadProgress();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const saveProgress = async () => {
      try {
        await AsyncStorage.setItem(
          PROGRESS_STORAGE_KEY,
          JSON.stringify(Array.from(completedPuzzleIds))
        );
      } catch {
      }
    };

    saveProgress();
  }, [completedPuzzleIds, isHydrated]);

  const markPuzzleComplete = (puzzleId: string) => {
    setCompletedPuzzleIds((current) => {
      if (current.has(puzzleId)) return current;
      const next = new Set(current);
      next.add(puzzleId);
      return next;
    });
  };

  const resetProgress = () => {
    setCompletedPuzzleIds(new Set());
    AsyncStorage.removeItem(PROGRESS_STORAGE_KEY).catch(() => {});
  };

  const isPuzzleComplete = (puzzleId: string) => completedPuzzleIds.has(puzzleId);

  const isShapeComplete = (sides: number) => {
    const totalPuzzles = getPuzzleCountForSides(sides);

    for (let puzzleNumber = 1; puzzleNumber <= totalPuzzles; puzzleNumber++) {
      if (!completedPuzzleIds.has(makePuzzleId(sides, puzzleNumber))) {
        return false;
      }
    }

    return totalPuzzles > 0;
  };

  const isShapeUnlocked = (sides: number) => {
    const levelIndex = shapeLevels.findIndex((shape) => shape.sides === sides);
    if (levelIndex <= 0) return true;

    const previousShape = shapeLevels[levelIndex - 1];
    return isShapeComplete(previousShape.sides);
  };

  const isPuzzleUnlocked = (sides: number, puzzleNumber: number) => {
    if (!isShapeUnlocked(sides)) return false;
    if (puzzleNumber <= 1) return true;

    return completedPuzzleIds.has(makePuzzleId(sides, puzzleNumber - 1));
  };

  const value = useMemo(
    () => ({
      completedPuzzleIds,
      markPuzzleComplete,
      resetProgress,
      isPuzzleComplete,
      isShapeUnlocked,
      isPuzzleUnlocked,
      isShapeComplete,
    }),
    [completedPuzzleIds]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }

  return context;
}
