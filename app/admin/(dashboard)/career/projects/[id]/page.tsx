import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deleteProject, updateProject } from "@/lib/actions/career";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function EditProjectPage(
  props: PageProps<"/admin/career/projects/[id]">,
) {
  const { id } = await props.params;

  const project = await db.project.findUnique({
    where: { id },
    include: { coverMedia: true },
  });

  if (!project) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Edit Project
        </h1>
        <DeleteButton
          action={deleteProject.bind(null, project.id)}
          confirmMessage="Delete this project?"
        />
      </div>
      <div className="mt-8">
        <ProjectForm
          project={project}
          action={updateProject.bind(null, project.id)}
        />
      </div>
    </div>
  );
}
