import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex items-center justify-between text-sm">
      {page > 1 ? (
        <Link
          href={`${basePath}?page=${page - 1}`}
          className="text-muted transition-colors hover:text-foreground"
        >
          ← Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-muted">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={`${basePath}?page=${page + 1}`}
          className="text-muted transition-colors hover:text-foreground"
        >
          Next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
