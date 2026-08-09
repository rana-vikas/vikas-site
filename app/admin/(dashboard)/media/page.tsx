import Image from "next/image";
import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage/url";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await db.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Media Library</h1>
      <p className="mt-2 text-sm text-muted">
        Files are uploaded from within each content form (Travel, Photography).
        This is a read-only view of everything stored so far.
      </p>
      {media.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative aspect-square">
                <Image
                  src={publicUrl(item.key)}
                  alt={item.alt ?? item.key}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <p className="truncate p-2 text-xs text-muted">{item.key}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted">No media uploaded yet.</p>
      )}
    </div>
  );
}
