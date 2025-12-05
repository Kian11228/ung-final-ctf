'use client';
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
    return `${hours}h ${minutes}m`;
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
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}