'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Solve {
  challengeId: string;
  timestamp: string;
  points: number;
  timeBonus: number;
}

interface UserProgress {
  solves: Solve[];
  hintsRevealed: Record<string, number[]>;
  startTime: number;
  studentName: string;
  studentId: string;
}

interface CTFStore extends UserProgress {
  addSolve: (solve: Solve) => void;
  revealHint: (challengeId: string, hintIndex: number) => void;
  setStudentInfo: (name: string, id: string) => void;
  reset: () => void;
  getTotalScore: () => number;
  getChallengesSolved: () => number;
  getSessionDuration: () => number;
}

const initialState: UserProgress = {
  solves: [],
  hintsRevealed: {},
  startTime: Date.now(),
  studentName: '',
  studentId: '',
};

export const useCTFStore = create<CTFStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      addSolve: (solve) => {
        set((state) => ({
          solves: [...state.solves, solve],
        }));
      },
      
      revealHint: (challengeId, hintIndex) => {
        set((state) => {
          const current = state.hintsRevealed[challengeId] || [];
          return {
            hintsRevealed: {
              ...state.hintsRevealed,
              [challengeId]: [...current, hintIndex],
            },
          };
        });
      },
      
      setStudentInfo: (name, id) => {
        set({ studentName: name, studentId: id });
      },
      
      reset: () => {
        set({ ...initialState, startTime: Date.now() });
      },
      
      getTotalScore: () => {
        return get().solves.reduce((sum, solve) => sum + solve.points + solve.timeBonus, 0);
      },
      
      getChallengesSolved: () => {
        return get().solves.length;
      },
      
      getSessionDuration: () => {
        return Date.now() - get().startTime;
      },
    }),
    {
      name: 'ctf-storage',
    }
  )
);