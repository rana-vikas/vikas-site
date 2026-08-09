export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-6 py-32">
      <p className="text-sm uppercase tracking-widest text-muted">
        Phase 1 — Foundation
      </p>
      <h1 className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-5xl font-semibold tracking-tight text-transparent">
        Vikas Rana
      </h1>
      <p className="max-w-xl text-muted">
        Next.js, Tailwind, Postgres, and MinIO are wired up and running in
        Docker. This placeholder confirms the stack works end to end.
      </p>
    </div>
  );
}
