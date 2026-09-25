import { useState, type PointerEvent } from "react";
import { MAILTO } from "@/content";
import { downloadPdf, type PdfKind } from "@/utils/pdf-generator";
import { Feather } from "./Feather";
import { Note } from "./Notes";

/**
 * The one authored moment. The envelope is read, a feather rocks down out of
 * the dark and tucks itself behind the name: a feather in the cap.
 */
export function Hero() {
  const [downloaded, setDownloaded] = useState<PdfKind | null>(null);

  const quickDownload = async (kind: PdfKind) => {
    await downloadPdf(kind);
    setDownloaded(kind);
    window.setTimeout(() => {
      setDownloaded((curr) => (curr === kind ? null : curr));
    }, 2600);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--hero-spot-x", `${Math.round(x * 100)}%`);
    event.currentTarget.style.setProperty("--hero-spot-y", `${Math.round(y * 100)}%`);
    event.currentTarget.style.setProperty("--feather-shift-x", `${(x - 0.5) * 18}px`);
    event.currentTarget.style.setProperty("--feather-shift-y", `${(y - 0.5) * -14}px`);
  };

  const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--hero-spot-x", "72%");
    event.currentTarget.style.setProperty("--hero-spot-y", "-6%");
    event.currentTarget.style.setProperty("--feather-shift-x", "0px");
    event.currentTarget.style.setProperty("--feather-shift-y", "0px");
  };

  return (
    <section
      aria-labelledby="name"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-plum text-bone"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div aria-hidden="true" className="hero-spot pointer-events-none absolute inset-0 -z-10" />

      <div className="hero-top mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-4 px-6 pt-6 text-[13px] md:px-10 md:pt-8">
        <p className="font-semibold">Media kit, 2026</p>
        <div className="flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={() => quickDownload("overview")}
            className="cursor-pointer font-semibold text-bone/85 underline decoration-bone/30 underline-offset-[6px] transition-colors hover:text-marigold hover:decoration-marigold"
          >
            {downloaded === "overview" ? "Overview PDF saved" : "Overview PDF"}
          </button>
          <button
            type="button"
            onClick={() => quickDownload("brands")}
            className="cursor-pointer font-semibold text-bone/85 underline decoration-bone/30 underline-offset-[6px] transition-colors hover:text-flare hover:decoration-flare"
          >
            {downloaded === "brands" ? "Brands PDF saved" : "Brand Affiliations PDF"}
          </button>
          <a
            href={MAILTO}
            className="font-semibold text-marigold underline decoration-marigold/45 underline-offset-[6px] transition-colors hover:text-bone hover:decoration-bone"
          >
            Book Dominic
          </a>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col justify-center px-6 pb-10 pt-16 md:px-10 md:pb-14 md:pt-10">
        <p className="hero-kicker wonk font-display text-[clamp(1.35rem,3vw,2.75rem)] font-light italic leading-none text-bone/80">
          And the Feather goes to…
        </p>

        <h1
          id="name"
          className="relative isolate mt-5 font-display text-[clamp(3.5rem,21vw,9rem)] font-normal leading-[0.86] tracking-[-0.025em] md:mt-6 md:text-[clamp(6rem,17vw,17.5rem)]"
        >
          <span className="name-mask name-mask--1">
            <span>Dominic</span>
          </span>{" "}
          <span className="block pl-[1.3em] md:pl-[1.9em]">
            <span className="relative inline-block">
              <span className="name-mask name-mask--2">
                <span>Zaca</span>
              </span>
              <span
                aria-hidden="true"
                className="hero-feather-anchor absolute bottom-[0.02em] left-[70%] -z-10 h-[2.3em] w-[0.787em] [--tilt:17deg] md:h-[2.05em] md:w-[0.7em] md:[--tilt:23deg]"
              >
                <span className="feather-fall block h-full w-full">
                  <span className="feather-tilt block h-full w-full">
                    <span className="feather-breeze feather-glow block h-full w-full">
                      <Feather uid="hero-d" className="hidden h-full w-full md:block" />
                      <Feather uid="hero-m" perSide={60} stroke={3} shaft={1.8} className="block h-full w-full md:hidden" />
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </h1>

        <div className="hero-after mt-10 grid gap-6 border-t border-bone/15 pt-6 md:mt-14 md:grid-cols-12 md:gap-10 md:pt-8">
          <div className="md:col-span-6">
            <p className="text-balance font-display text-[clamp(1.45rem,2.3vw,2.25rem)] leading-[1.08] text-marigold">
              Social Media Personality of the Year
            </p>
            <p className="mt-2 text-[15px] text-bone/70">Winner, 17th Feather Awards, 2025</p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="max-w-md text-[16px] leading-[1.65] text-bone/80">
              Media personality, MC, content creator and LGBTQIA+ activist. 2.2 million followers on TikTok, and
              reliably the boldest look in the room.
            </p>
            <Note className="mt-6">
              Pronouns: the copy is pronoun-free for now. Press has used both she/her and they/them, so I’d set this
              with you before anything goes live.
            </Note>
          </div>
        </div>
      </div>
    </section>
  );
}
