import Link from "next/link";
import { db } from "@/lib/db";
import { createAlbum, createEquipment, deleteEquipment } from "@/lib/actions/photography";
import { AlbumForm } from "@/components/admin/AlbumForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminPhotographyPage() {
  const [albums, equipment] = await Promise.all([
    db.photoAlbum.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { photos: true } } },
    }),
    db.equipment.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-16">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Photography</h1>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">Albums</h2>
        <div className="mt-4 space-y-2">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/admin/photography/${album.id}`}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-cyan/40"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {album.title}
                </p>
                <p className="text-xs text-muted">
                  {album._count.photos} photos
                </p>
              </div>
              <span
                className={`rounded-full border border-white/10 px-2 py-1 text-xs ${
                  album.published ? "text-muted" : "text-muted/60"
                }`}
              >
                {album.published ? "Published" : "Draft"}
              </span>
            </Link>
          ))}
          {albums.length === 0 && (
            <p className="text-sm text-muted">No albums yet.</p>
          )}
        </div>
        <div className="mt-6">
          <h3 className="text-sm text-muted">New album</h3>
          <div className="mt-2">
            <AlbumForm action={createAlbum} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">Equipment</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {equipment.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-foreground"
            >
              {item.name}
              <DeleteButton
                action={deleteEquipment.bind(null, item.id)}
                confirmMessage={`Remove ${item.name}?`}
                label="✕"
              />
            </div>
          ))}
          {equipment.length === 0 && (
            <p className="text-sm text-muted">No equipment listed yet.</p>
          )}
        </div>
        <form
          action={createEquipment}
          className="mt-4 flex max-w-lg flex-wrap items-end gap-2"
        >
          <input
            name="name"
            placeholder="Name"
            required
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="category"
            placeholder="Category (optional)"
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <button
            type="submit"
            className="rounded-full bg-white/[0.06] px-4 py-2 text-xs text-foreground hover:bg-white/[0.1]"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
