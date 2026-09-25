import { useEffect, useState } from "react";
import { downloadPdf, getGeneratedPdf, type GeneratedPdf, type PdfKind } from "@/utils/pdf-generator";
import { cn } from "@/utils/cn";
import { FeatherGlyph, WaxSeal } from "./Ornaments";
import { Note } from "./Notes";

type DossierSpec = {
  kind: PdfKind;
  heading: string;
  subhead: string;
  filename: string;
  cta: string;
  summary: string;
  contents: Array<[string, string]>;
  tilt: string;
  accent: "marigold" | "flare";
};

const DOSSIERS: DossierSpec[] = [
  {
    kind: "overview",
    heading: "Overview of Dominic",
    subhead: "Who Dominic is, the Feather win, audience reach & screen work",
    filename: "Dominic-Zaca-Overview-2026.pdf",
    cta: "Download Overview PDF",
    summary:
      "A two-page A4 portrait for press, producers and event bookers: biography, the 17th Feather Awards win, 2.2M TikTok reach and television roles across Moja Love, Showmax and Mnet.",
    contents: [
      ["Page one", "Biography, public pull-quote, 17th Feather Awards win & key facts"],
      ["Page two", "2.2M TikTok & 101M+ likes breakdown, platform ledger & TV credits"],
    ],
    tilt: "-rotate-[1.4deg]",
    accent: "marigold",
  },
  {
    kind: "brands",
    heading: "Brand affiliations, fashion & fit",
    subhead: "Couture houses, Omoda 2026, award bodies, sizes & booking scope",
    filename: "Dominic-Zaca-Brand-Affiliations-2026.pdf",
    cta: "Download Brand Affiliations PDF",
    summary:
      "A separate two-page A4 sheet tailored for brand managers, PR agencies and stylists: red-carpet houses, the Omoda 2026 Durban July invitation, fitting room measurements and commercial deliverables.",
    contents: [
      ["Page one", "Vallure Designs, Indoni Fashion House, Khosi Nkosi, Omoda 2026 & award tags"],
      ["Page two", "Fitting room measurements (1.64m, shoe 9, UK 24) & commercial booking scope"],
    ],
    tilt: "rotate-[1.4deg]",
    accent: "flare",
  },
];

export function Dossiers() {
  const [pdfs, setPdfs] = useState<Partial<Record<PdfKind, GeneratedPdf>>>({});
  const [busy, setBusy] = useState<PdfKind | null>(null);
  const [justDownloaded, setJustDownloaded] = useState<PdfKind | null>(null);
  const [inspectKind, setInspectKind] = useState<PdfKind | null>(null);
  const [inspectPage, setInspectPage] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const kind of ["overview", "brands"] as const) {
        try {
          const res = await getGeneratedPdf(kind);
          if (!cancelled) {
            setPdfs((prev) => ({ ...prev, [kind]: res }));
          }
        } catch {
          // fallback on click if pre-render fails
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!inspectKind) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInspectKind(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inspectKind]);

  const handleDownload = async (kind: PdfKind) => {
    setBusy(kind);
    try {
      const res = await downloadPdf(kind);
      setPdfs((prev) => ({ ...prev, [kind]: res }));
      setJustDownloaded(kind);
      window.setTimeout(() => {
        setJustDownloaded((curr) => (curr === kind ? null : curr));
      }, 2800);
    } finally {
      setBusy(null);
    }
  };

  const openInspector = async (kind: PdfKind, pageIndex = 0) => {
    setInspectPage(pageIndex);
    setInspectKind(kind);
    if (!pdfs[kind]) {
      const res = await getGeneratedPdf(kind);
      setPdfs((prev) => ({ ...prev, [kind]: res }));
    }
  };

  const activePdf = inspectKind ? pdfs[inspectKind] : undefined;
  const activeSpec = inspectKind ? DOSSIERS.find((d) => d.kind === inspectKind) : undefined;

  return (
    <section
      id="dossiers"
      aria-labelledby="take-it"
      className="grain relative isolate overflow-hidden border-t border-bone/15 bg-plum text-bone"
    >
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:px-10 md:py-36">
        <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
          <div className="md:col-span-7">
            <p className="wonk font-display text-[clamp(1.35rem,2.4vw,2.1rem)] italic text-marigold">
              Two separate PDFs, ready for the inbox
            </p>
            <h2
              id="take-it"
              className="mt-3 font-display text-[clamp(2.9rem,7.2vw,7.2rem)] leading-[0.9] tracking-[-0.03em]"
            >
              Take the kit with you.
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="max-w-md text-[17px] leading-[1.65] text-bone/80">
              One sheet for producers and press who want the full story of Dominic; a second, separate sheet for
              brand managers and stylists looking at fashion houses, partnerships and wardrobe fit.
            </p>
            <Note className="mt-6" tilt={-1}>
              Splitting the downloads into two PDFs means a casting director gets your bio and screen credits, while a
              brand or fashion house gets Vallure, Indoni, Khosi Nkosi, Omoda and your sizes right on page one.
            </Note>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          {DOSSIERS.map((d) => {
            const ready = pdfs[d.kind];
            const isMarigold = d.accent === "marigold";
            const isDownloaded = justDownloaded === d.kind;
            const isBusy = busy === d.kind;

            return (
              <article
                key={d.kind}
                className={cn(
                  "relative flex flex-col justify-between border p-7 sm:p-10 lg:col-span-6",
                  isMarigold
                    ? "border-marigold/35 bg-[#23131b]"
                    : "border-flare/45 bg-[#26121c]",
                )}
              >
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-bone/15 pb-5">
                    <p
                      className={cn(
                        "wonk font-display text-[1.25rem] italic",
                        isMarigold ? "text-marigold" : "text-flare",
                      )}
                    >
                      {d.subhead}
                    </p>
                    <span className="text-[13px] font-semibold text-bone/60">
                      2 A4 pages{ready ? `, ${ready.sizeKb} KB PDF` : ", PDF"}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-[clamp(2.2rem,3.8vw,3.4rem)] leading-[0.98] tracking-[-0.02em]">
                    {d.heading}
                  </h3>
                  <p className="mt-4 text-[16px] leading-[1.65] text-bone/80">{d.summary}</p>

                  {/* Fanned A4 page spread preview */}
                  <div className="relative my-10 flex items-center justify-center py-4">
                    {ready && ready.pagePreviews.length >= 2 ? (
                      <div className="relative mx-auto flex w-full max-w-[460px] items-center justify-center">
                        <button
                          type="button"
                          onClick={() => openInspector(d.kind, 0)}
                          aria-label={`Inspect page 1 of ${d.heading}`}
                          className={cn(
                            "group relative z-10 w-[56%] cursor-pointer shadow-[0_28px_50px_-18px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:z-30 hover:scale-[1.03]",
                            d.tilt,
                          )}
                        >
                          <img
                            src={ready.pagePreviews[0]}
                            alt={`${d.heading} PDF page 1 preview`}
                            className="aspect-[1/1.414] w-full border border-bone/20 object-cover"
                          />
                          <span className="absolute bottom-2.5 left-2.5 bg-plum/90 px-2.5 py-1 text-[11px] font-semibold text-bone">
                            Page 1
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openInspector(d.kind, 1)}
                          aria-label={`Inspect page 2 of ${d.heading}`}
                          className="group relative z-20 -ml-10 mt-8 w-[56%] rotate-[2.2deg] cursor-pointer shadow-[0_28px_50px_-18px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:z-30 hover:scale-[1.03]"
                        >
                          <img
                            src={ready.pagePreviews[1]}
                            alt={`${d.heading} PDF page 2 preview`}
                            className="aspect-[1/1.414] w-full border border-bone/20 object-cover"
                          />
                          <span className="absolute bottom-2.5 right-2.5 bg-plum/90 px-2.5 py-1 text-[11px] font-semibold text-bone">
                            Page 2
                          </span>
                        </button>

                        {isMarigold && (
                          <WaxSeal className="pointer-events-none absolute -bottom-5 left-4 z-30 h-20 w-20 -rotate-12" />
                        )}
                      </div>
                    ) : (
                      <div className="flex aspect-[16/10] w-full items-center justify-center border border-dashed border-bone/20 text-[14px] text-bone/60">
                        <FeatherGlyph className="mr-2 h-4 w-4 text-marigold" />
                        Typesetting A4 pages…
                      </div>
                    )}
                  </div>

                  {/* Page breakdown */}
                  <dl className="divide-y divide-bone/12 border-y border-bone/15">
                    {d.contents.map(([pageLabel, desc]) => (
                      <div key={pageLabel} className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-12 sm:gap-4">
                        <dt className="font-display text-[1.05rem] italic text-bone/75 sm:col-span-3">{pageLabel}</dt>
                        <dd className="text-[14px] leading-relaxed text-bone/80 sm:col-span-9">{desc}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(d.kind)}
                    disabled={isBusy}
                    className={cn(
                      "cursor-pointer px-6 py-3.5 text-[15px] font-bold transition-colors",
                      isMarigold
                        ? "bg-marigold text-plum hover:bg-bone"
                        : "bg-flare text-bone hover:bg-bone hover:text-ink",
                    )}
                  >
                    <span aria-live="polite">
                      {isBusy
                        ? "Preparing PDF…"
                        : isDownloaded
                          ? `Downloaded ${d.filename}`
                          : d.cta}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openInspector(d.kind, 0)}
                    className="cursor-pointer border border-bone/30 px-5 py-3.5 text-[14px] font-semibold text-bone transition-colors hover:border-marigold hover:text-marigold"
                  >
                    Inspect pages
                  </button>

                  {ready && (
                    <a
                      href={ready.url}
                      download={ready.filename}
                      className="ml-auto text-[12px] text-bone/55 underline decoration-bone/25 underline-offset-4 transition-colors hover:text-bone"
                    >
                      {ready.filename}
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Full-size A4 sheet inspector modal */}
      {inspectKind && activeSpec && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of ${activeSpec.heading}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setInspectKind(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-[980px] flex-col border border-bone/20 bg-plum text-bone shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bone/15 px-6 py-4">
              <div>
                <p className="font-display text-[1.35rem] leading-tight">{activeSpec.heading}</p>
                <p className="text-[12px] text-bone/60">{activeSpec.filename}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {[0, 1].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInspectPage(idx)}
                    className={cn(
                      "cursor-pointer px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                      inspectPage === idx
                        ? "bg-bone text-ink"
                        : "border border-bone/25 text-bone/80 hover:border-bone",
                    )}
                  >
                    Page {idx + 1} of 2
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handleDownload(inspectKind)}
                  className="cursor-pointer bg-marigold px-4 py-1.5 text-[13px] font-bold text-plum transition-colors hover:bg-bone"
                >
                  {justDownloaded === inspectKind ? "Downloaded PDF" : "Download PDF"}
                </button>

                <button
                  type="button"
                  onClick={() => setInspectKind(null)}
                  className="cursor-pointer border border-bone/25 px-3.5 py-1.5 text-[13px] font-semibold text-bone/80 transition-colors hover:border-flare hover:text-bone"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-4 sm:p-8">
              {activePdf ? (
                <img
                  src={activePdf.pagePreviews[inspectPage]}
                  alt={`${activeSpec.heading} Page ${inspectPage + 1}`}
                  className="mx-auto max-w-full border border-bone/20 shadow-2xl"
                />
              ) : (
                <p className="py-20 text-center text-[15px] text-bone/70">Rendering page preview…</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
