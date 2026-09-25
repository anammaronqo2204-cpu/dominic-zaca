import { useEffect, useRef, useState } from "react";
import { EMAIL, MAILTO, SOCIALS } from "@/content";
import { downloadPdf, type PdfKind } from "@/utils/pdf-generator";
import { Feather } from "./Feather";
import { Note } from "./Notes";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }
}

export function Booking() {
  const [copy, setCopy] = useState<"idle" | "done" | "failed">("idle");
  const [savedPdf, setSavedPdf] = useState<PdfKind | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const onQuickPdf = async (kind: PdfKind) => {
    await downloadPdf(kind);
    setSavedPdf(kind);
    window.setTimeout(() => {
      setSavedPdf((curr) => (curr === kind ? null : curr));
    }, 2600);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    const ok = await copyText(EMAIL);
    setCopy(ok ? "done" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopy("idle"), 2800);
  };

  const copyLabel =
    copy === "done"
      ? "Copied. The inbox awaits."
      : copy === "failed"
        ? "Couldn’t copy. Select the address above."
        : "Copy the address";

  return (
    <section aria-labelledby="scene" className="grain relative isolate overflow-hidden bg-plum text-bone">
      {/* The feather again, at rest: bookends the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[4%] top-[8%] -z-10 hidden h-[80%] w-[28%] rotate-[18deg] opacity-25 md:block"
      >
        <Feather uid="coda" className="h-full w-full" />
      </div>

      <div className="mx-auto max-w-[1320px] px-6 pb-20 pt-28 md:px-10 md:pb-24 md:pt-40">
        <h2
          id="scene"
          className="max-w-[9em] font-display text-[clamp(3.3rem,10.5vw,11rem)] leading-[0.86] tracking-[-0.04em]"
        >
          Let’s make a scene.
        </h2>
        <p className="mt-8 max-w-xl text-[18px] leading-[1.6] text-bone/80">
          Hosting, campaigns, appearances, collaborations. Send the brief, the date and the dress code.
        </p>

        <a
          href={MAILTO}
          className="wonk group mt-14 inline-block font-display text-[clamp(2.1rem,9.5vw,3.6rem)] italic leading-[1.02] tracking-[-0.02em] text-marigold transition-colors duration-300 hover:text-bone sm:text-[clamp(2rem,6.3vw,5.8rem)]"
        >
          <span className="block sm:inline">bookzacadominic</span>
          <span className="block sm:inline">@gmail.com</span>
          <span
            aria-hidden="true"
            className="mt-3 block h-[2px] w-full bg-marigold/45 transition-colors duration-300 group-hover:bg-flare"
          />
        </a>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={MAILTO}
            className="bg-marigold px-6 py-3.5 text-[15px] font-bold text-plum transition-colors hover:bg-bone"
          >
            Email Dominic
          </a>
          <button
            type="button"
            onClick={onCopy}
            className="cursor-pointer border border-bone/30 px-6 py-3.5 text-[15px] font-semibold transition-colors hover:border-marigold hover:text-marigold"
          >
            <span aria-live="polite">{copyLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => onQuickPdf("overview")}
            className="cursor-pointer border border-bone/30 px-5 py-3.5 text-[15px] font-semibold transition-colors hover:border-marigold hover:text-marigold"
          >
            {savedPdf === "overview" ? "Overview PDF downloaded" : "Overview PDF"}
          </button>
          <button
            type="button"
            onClick={() => onQuickPdf("brands")}
            className="cursor-pointer border border-bone/30 px-5 py-3.5 text-[15px] font-semibold transition-colors hover:border-flare hover:text-flare"
          >
            {savedPdf === "brands" ? "Brand Affiliations PDF downloaded" : "Brand Affiliations PDF"}
          </button>
        </div>
        <Note className="mt-8">
          Everything here came from public sources. The real kit is yours to shape: the order, the tone, what’s in
          and what’s out.
        </Note>

        <div className="mt-24 grid gap-12 border-t border-bone/15 pt-10 md:mt-32 md:grid-cols-12 md:gap-10">
          <ul className="grid gap-x-10 gap-y-7 sm:grid-cols-2 md:col-span-7">
            {SOCIALS.map((s) => (
              <li key={s.platform}>
                <p className="text-[13px] text-bone/60">{s.platform}</p>
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-display text-[clamp(1.5rem,2.3vw,2.1rem)] leading-tight transition-colors hover:text-marigold"
                  >
                    {s.handle}
                  </a>
                ) : (
                  <p className="font-display text-[clamp(1.5rem,2.3vw,2.1rem)] leading-tight">{s.handle}</p>
                )}
              </li>
            ))}
          </ul>
          <div className="md:col-span-4 md:col-start-9">
            <p className="wonk font-display text-[clamp(1.6rem,2.5vw,2.3rem)] italic leading-[1.12] text-marigold">
              Book Dominic. Consider it a feather in your cap.
            </p>
            <p className="mt-5 text-[14px] leading-relaxed text-bone/60">
              Based in KwaZulu-Natal and Johannesburg. Works in English and isiZulu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-bone/10 bg-plum">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-6 pb-28 pt-8 text-[12px] leading-relaxed text-bone/60 md:flex-row md:justify-between md:gap-10 md:px-10">
        <p>A sample media kit, prepared for Dominic Zaca as a proposal. Not an official page.</p>
        <p>Figures from public profiles and press, 2026. Image frames hold stand-in textures.</p>
      </div>
    </footer>
  );
}
