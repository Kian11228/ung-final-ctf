'use client';
import { useEffect, useState } from 'react';
import { useCTFStore } from '@/lib/store';

/** True once the component has mounted, so persisted browser state can be read safely. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/**
 * Asks for the student's name and ID. The ID determines which flag variant the
 * student is assigned for every challenge, so it is set once and only changed
 * by resetting progress.
 */
export function StudentIdForm() {
  const setStudentInfo = useCTFStore((s) => s.setStudentInfo);
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!id.trim()) return;
        setStudentInfo(name.trim(), id.trim());
      }}
    >
      <p className="text-sm text-muted-foreground">
        Enter your student ID to get your challenge files and submit flags. Your files and flags are
        specific to your ID.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          autoComplete="name"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Student ID"
          required
          className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
      >
        Continue
      </button>
    </form>
  );
}

/** Shows who is signed in, with a way to switch students by resetting local progress. */
export function StudentBadge() {
  const { studentName, studentId, reset } = useCTFStore();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
      <span>
        Signed in as <strong className="text-foreground">{studentName || 'student'}</strong> (ID{' '}
        <span className="font-mono">{studentId}</span>)
      </span>
      <button
        type="button"
        className="underline hover:text-foreground"
        onClick={() => {
          if (
            window.confirm(
              'Switching students clears all progress saved in this browser, including solved challenges. Continue?'
            )
          ) {
            reset();
          }
        }}
      >
        Not you? Reset
      </button>
    </div>
  );
}
