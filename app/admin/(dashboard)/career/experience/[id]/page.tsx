import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deleteExperience, updateExperience } from "@/lib/actions/career";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage(
  props: PageProps<"/admin/career/experience/[id]">,
) {
  const { id } = await props.params;

  const experience = await db.experience.findUnique({ where: { id } });

  if (!experience) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Edit Experience
        </h1>
        <DeleteButton
          action={deleteExperience.bind(null, experience.id)}
          confirmMessage="Delete this experience entry?"
        />
      </div>
      <div className="mt-8">
        <ExperienceForm
          experience={experience}
          action={updateExperience.bind(null, experience.id)}
        />
      </div>
    </div>
  );
}
