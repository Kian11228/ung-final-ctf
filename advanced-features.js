#!/usr/bin/env node
/**
 * ADVANCED FEATURES - Professional CTF Platform
 * Adds state management, animations, and advanced components
 */

const fs = require('fs');

console.log('🔥 Adding ADVANCED FEATURES...\n');

// Create lib/store.ts - Advanced state management
fs.writeFileSync('lib/store.ts', `'use client';
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
);`);

// Create components/progress-tracker.tsx
fs.writeFileSync('components/progress-tracker.tsx', `'use client';
import { useCTFStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Trophy, Clock, Target } from 'lucide-react';

export function ProgressTracker() {
  const { getTotalScore, getChallengesSolved, getSessionDuration } = useCTFStore();
  
  const score = getTotalScore();
  const solved = getChallengesSolved();
  const duration = getSessionDuration();
  
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return \`\${hours}h \${minutes}m\`;
  };

  const stats = [
    { icon: Trophy, label: 'Score', value: score, color: 'text-yellow-500' },
    { icon: Target, label: 'Solved', value: solved, color: 'text-green-500' },
    { icon: Clock, label: 'Time', value: formatDuration(duration), color: 'text-blue-500' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
        >
          <div className="rounded-lg bg-primary/10 p-3">
            <stat.icon className={\`h-5 w-5 \${stat.color}\`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}`);

// Create components/animated-counter.tsx
fs.writeFileSync('components/animated-counter.tsx', `'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

export function AnimatedCounter({ value, duration = 1 }: AnimatedCounterProps) {
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => Math.round(current));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    spring.set(value);
    const unsubscribe = display.on('change', setDisplayValue);
    return () => unsubscribe();
  }, [value, spring, display]);

  return <motion.span>{displayValue}</motion.span>;
}`);

// Create components/challenge-progress.tsx
fs.writeFileSync('components/challenge-progress.tsx', `'use client';
import { useCTFStore } from '@/lib/store';
import { getAllChallenges } from '@/lib/content';
import { motion } from 'framer-motion';

export function ChallengeProgress() {
  const { solves } = useCTFStore();
  const challenges = getAllChallenges();
  
  const progress = (solves.length / challenges.length) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Overall Progress</span>
        <span className="font-medium">{solves.length} / {challenges.length}</span>
      </div>
      
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: \`\${progress}%\` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}`);

// Create components/toast.tsx - Better notifications
fs.writeFileSync('components/toast.tsx', `'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastQueue: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

export const toast = {
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  info: (message: string) => addToast(message, 'info'),
};

function addToast(message: string, type: ToastType) {
  const id = Math.random().toString(36).substring(7);
  toastQueue = [...toastQueue, { id, message, type }];
  listeners.forEach((listener) => listener(toastQueue));
  
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(toastQueue));
  }, 5000);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'border-green-500 bg-green-500/10 text-green-500',
    error: 'border-red-500 bg-red-500/10 text-red-500',
    info: 'border-blue-500 bg-blue-500/10 text-blue-500',
  };

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={\`pointer-events-auto flex items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm \${colors[t.type]}\`}
            >
              <Icon className="h-5 w-5" />
              <p className="text-sm font-medium">{t.message}</p>
              <button
                onClick={() => {
                  toastQueue = toastQueue.filter((toast) => toast.id !== t.id);
                  listeners.forEach((listener) => listener(toastQueue));
                }}
                className="ml-4 opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}`);

console.log('✅ Advanced state management created!');
console.log('✅ Progress tracker components created!');
console.log('✅ Toast notification system created!');
console.log('✅ Animated counter created!');

console.log('\n📦 Installing Zustand for state management...');

try {
  const { execSync } = require('child_process');
  execSync('npm install zustand', { stdio: 'inherit' });
  console.log('\n✅ Zustand installed!');
} catch (error) {
  console.log('\n⚠️  Please run: npm install zustand');
}

console.log('\n🎉 Advanced features added!');
console.log('\nNext: Run the style upgrade for the final touch!\n');
