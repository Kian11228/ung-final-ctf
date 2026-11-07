'use client';
import { Download, FileText } from 'lucide-react';
import { useCTFStore } from '@/lib/store';
import { getAssignedVariant, type FlagVariant } from '@/lib/flag';
import { StudentBadge, StudentIdForm, useHydrated } from '@/components/student-id';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

interface ChallengeFilesProps {
  challengeId: string;
  variants: FlagVariant[];
  /** Files shared by every variant, relative to the challenge's assets folder. */
  sharedFiles: string[];
  /** Variant-specific files keyed by variant id, relative to the assets folder. */
  variantFiles: Record<string, string[]>;
}

function FileLink({ challengeId, file }: { challengeId: string; file: string }) {
  const name = file.split('/').pop() ?? file;

  return (
    <a
      href={`${basePath}/challenge-files/${challengeId}/${file}`}
      download={name}
      className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-primary" />
        <p className="font-medium">{name}</p>
      </div>
      <Download className="h-4 w-4 text-muted-foreground" />
    </a>
  );
}

export function ChallengeFiles({ challengeId, variants, sharedFiles, variantFiles }: ChallengeFilesProps) {
  const hydrated = useHydrated();
  const studentId = useCTFStore((s) => s.studentId);

  if (!hydrated) return null;

  if (!studentId) return <StudentIdForm />;

  const assigned = getAssignedVariant(studentId, challengeId, variants);
  const files = [...sharedFiles, ...(variantFiles[assigned.id] ?? [])];

  return (
    <div className="space-y-3">
      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground">No files are attached to this challenge yet.</p>
      ) : (
        files.map((file) => <FileLink key={file} challengeId={challengeId} file={file} />)
      )}
      <StudentBadge />
    </div>
  );
}
