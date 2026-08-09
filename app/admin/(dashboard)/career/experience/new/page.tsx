import { createExperience } from "@/lib/actions/career";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        New Experience
      </h1>
      <div className="mt-8">
        <ExperienceForm action={createExperience} />
      </div>
    </div>
  );
}
