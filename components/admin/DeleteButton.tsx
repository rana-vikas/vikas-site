"use client";

import { useTransition } from "react";

export function DeleteButton({
  action,
  label = "Delete",
  confirmMessage = "Are you sure?",
}: {
  action: () => Promise<void> | void;
  label?: string;
  confirmMessage?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmMessage)) {
          startTransition(() => {
            action();
          });
        }
      }}
      className="text-xs text-red-400 hover:underline disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}
