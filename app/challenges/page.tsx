import { getAllChallenges } from '@/lib/content';
import { ChallengeCard } from '@/components/challenge-card';

export default function ChallengesPage() {
  const challenges = getAllChallenges();

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-12">
      <div className="space-y-2 pb-8">
        <h1 className="text-4xl font-bold">Challenges</h1>
        <p className="text-muted-foreground">
          {challenges.length} challenges available
        </p>
      </div>

      {challenges.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="text-6xl">🎯</div>
            <h3 className="text-2xl font-bold">No Challenges Yet</h3>
            <p className="text-muted-foreground">
              Run the challenge creation script to add challenges!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.slug} challenge={challenge} />
          ))}
        </div>
      )}
    </div>
  );
}