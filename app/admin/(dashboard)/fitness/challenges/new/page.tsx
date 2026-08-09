import { createChallenge } from "@/lib/actions/fitness";
import { ChallengeForm } from "@/components/admin/ChallengeForm";

export default function NewChallengePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">New Challenge</h1>
      <div className="mt-8">
        <ChallengeForm action={createChallenge} />
      </div>
    </div>
  );
}
