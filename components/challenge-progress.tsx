'use client';
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
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}