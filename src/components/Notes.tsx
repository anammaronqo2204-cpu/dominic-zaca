import type { ReactNode } from "react";

type NoteProps = {
  children?: ReactNode;
  tone?: "plum" | "bone";
  tilt?: number;
  className?: string;
};

// Pitch-only annotations are intentionally omitted from the public-facing page.
export function Note(_props: NoteProps) {
  return null;
}
