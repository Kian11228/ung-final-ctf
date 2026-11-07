'use client';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useCTFStore } from '@/lib/store';
import { clientVerifyFlag, flagFormatToRegExp, type FlagVariant } from '@/lib/flag';
import { toast } from '@/components/toast';
import { StudentIdForm, useHydrated } from '@/components/student-id';

interface FlagSubmitProps {
  challengeId: string;
  points: number;
  format: string;
  salt: string;
  variants: FlagVariant[];
}

export function FlagSubmit({ challengeId, points, format, salt, variants }: FlagSubmitProps) {
  const hydrated = useHydrated();
  const { studentId, solves, addSolve } = useCTFStore();
  const [flag, setFlag] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!hydrated) return null;

  if (!studentId) return <StudentIdForm />;

  const solved = solves.some((s) => s.challengeId === challengeId);

  if (solved) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-500">
        <CheckCircle2 className="h-5 w-5" />
        <p className="font-medium">Solved. {points} points added to your progress.</p>
      </div>
    );
  }

  async function submit() {
    setChecking(true);
    setError(null);

    try {
      const result = await clientVerifyFlag(
        flag,
        salt,
        studentId,
        challengeId,
        variants,
        flagFormatToRegExp(format)
      );

      if (result.valid) {
        addSolve({ challengeId, timestamp: new Date().toISOString(), points, timeBonus: 0 });
        toast.success(`Correct! +${points} points`);
        setFlag('');
      } else {
        setError(result.error ?? 'Incorrect flag');
      }
    } finally {
      setChecking(false);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <input
        type="text"
        value={flag}
        onChange={(e) => {
          setFlag(e.target.value);
          setError(null);
        }}
        placeholder="ung{your_flag_here}"
        spellCheck={false}
        autoComplete="off"
        className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={checking || !flag.trim()}
        className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-60"
      >
        {checking ? 'Checking…' : 'Submit Flag'}
      </button>
    </form>
  );
}
