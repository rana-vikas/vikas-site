import Image from "next/image";
import type { Media, Project } from "@/lib/generated/prisma/client";
import { publicUrl } from "@/lib/storage/url";
import { FadeIn } from "@/components/animations/FadeIn";
import { HoverLift } from "@/components/animations/HoverLift";

type ProjectWithCover = Project & { coverMedia: Media | null };

export function ProjectsGrid({ projects }: { projects: ProjectWithCover[] }) {
  if (projects.length === 0) {
    return (
      <FadeIn>
        <p className="text-sm text-muted">Projects coming soon.</p>
      </FadeIn>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {projects.map((project, index) => {
        const href = project.url ?? project.repoUrl ?? undefined;
        const card = (
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            {project.coverMedia && (
              <div className="relative aspect-video">
                <Image
                  src={publicUrl(project.coverMedia.key)}
                  alt={project.coverMedia.alt ?? project.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg font-medium text-foreground">
                {project.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted">
                {project.summary}
              </p>
            </div>
          </div>
        );

        return (
          <FadeIn key={project.id} delay={index * 0.08}>
            <HoverLift className="h-full">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full transition-colors hover:border-cyan/40"
                >
                  {card}
                </a>
              ) : (
                card
              )}
            </HoverLift>
          </FadeIn>
        );
      })}
    </div>
  );
}
