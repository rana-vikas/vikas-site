import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage/url";
import { addPhoto, deleteAlbum, deletePhoto, updateAlbum } from "@/lib/actions/photography";
import { AlbumForm } from "@/components/admin/AlbumForm";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function EditAlbumPage(
  props: PageProps<"/admin/photography/[id]">,
) {
  const { id } = await props.params;

  const album = await db.photoAlbum.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { order: "asc" }, include: { media: true } },
    },
  });

  if (!album) {
    notFound();
  }

  const boundUpdate = updateAlbum.bind(null, album.id);
  const boundDelete = deleteAlbum.bind(null, album.id);

  return (
    <div className="space-y-16">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            Edit Album
          </h1>
          <DeleteButton action={boundDelete} confirmMessage="Delete this album and all its photos?" />
        </div>
        <div className="mt-8">
          <AlbumForm album={album} action={boundUpdate} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">Photos</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {album.photos.map((photo) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative aspect-square">
                <Image
                  src={publicUrl(photo.media.key)}
                  alt={photo.media.alt ?? photo.caption ?? "Photo"}
                  fill
                  unoptimized
                  className="object-cover"
                />
                {photo.featured && (
                  <span className="absolute left-2 top-2 rounded-full border border-cyan/30 bg-background/80 px-2 py-0.5 text-[10px] text-cyan">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-2">
                <p className="truncate text-xs text-muted">
                  {photo.caption ?? "—"}
                </p>
                <DeleteButton
                  action={deletePhoto.bind(null, photo.id)}
                  confirmMessage="Remove this photo?"
                  label="✕"
                />
              </div>
            </div>
          ))}
          {album.photos.length === 0 && (
            <p className="text-sm text-muted">No photos yet.</p>
          )}
        </div>

        <form
          action={addPhoto}
          className="mt-6 max-w-md space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4"
        >
          <input type="hidden" name="albumId" value={album.id} />
          <MediaUploadField name="mediaId" label="Photo" />
          <input
            name="caption"
            placeholder="Caption (optional)"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              name="camera"
              placeholder="Camera (optional)"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
            />
            <input
              name="lens"
              placeholder="Lens (optional)"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
            />
            <input
              name="aperture"
              placeholder="Aperture (optional)"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
            />
            <input
              name="shutterSpeed"
              placeholder="Shutter speed (optional)"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
            />
            <input
              name="iso"
              placeholder="ISO (optional)"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
            />
            <input
              name="focalLength"
              placeholder="Focal length (optional)"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              name="featured"
              className="h-4 w-4 rounded border-white/10 bg-white/[0.03]"
            />
            Featured (shows in homepage teaser)
          </label>
          <button
            type="submit"
            className="rounded-full bg-white/[0.06] px-4 py-2 text-xs text-foreground hover:bg-white/[0.1]"
          >
            Add photo
          </button>
        </form>
      </div>
    </div>
  );
}
