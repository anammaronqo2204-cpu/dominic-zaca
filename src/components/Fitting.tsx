import { useState } from "react";
import { SERVICES } from "@/content";
import { cn } from "@/utils/cn";
import { Barcode, FeatherGlyph } from "./Ornaments";

const SIZES: Array<[string, string]> = [
  ["Height", "1.64 m"],
  ["Shoe", "9"],
  ["Waist & shirt", "UK 24"],
];

/** A garment swing tag hanging from the seam above. Nudge it and it swings. */
function HangTag() {
  const [swinging, setSwinging] = useState(false);
  const nudge = () => setSwinging(true);

  return (
    <div className="relative mx-auto w-[min(300px,78vw)] md:mx-0 md:ml-[8%]">
      <div className="origin-top -rotate-[4deg]">
        <div
          role="button"
          tabIndex={0}
          aria-label="Swing tag with Dominic’s sizes. Press to give it a nudge."
          className={cn("tag-swing relative cursor-pointer pt-[132px]", swinging && "is-swinging")}
          onMouseEnter={nudge}
          onClick={nudge}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              nudge();
            }
          }}
          onAnimationEnd={() => setSwinging(false)}
        >
          {/* Gold cord, looped through the grommet */}
          <svg
            aria-hidden="true"
            viewBox="0 0 40 172"
            fill="none"
            className="absolute left-1/2 top-0 z-10 h-[172px] w-[40px] -translate-x-1/2 overflow-visible"
          >
            <path d="M20 0C15 60 15 128 20 170" stroke="#D9A02E" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 0C25 60 25 128 20 170" stroke="#B8841F" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <div className="[filter:drop-shadow(0_26px_28px_rgba(64,6,30,.45))]">
            <div className="paper relative px-7 pb-7 pt-16 text-ink [--paper-shadow:none] [clip-path:polygon(16%_0,84%_0,100%_11%,100%_100%,0_100%,0_11%)]">
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[25px] h-[28px] w-[28px] -translate-x-1/2 rounded-full border-[5px] border-marigold bg-flare shadow-[inset_0_2px_3px_rgba(0,0,0,.35)]"
              />
              <div className="flex items-baseline justify-between border-b border-ink/15 pb-3">
                <p className="font-display text-[1.45rem] leading-none">Dominic Zaca</p>
                <FeatherGlyph className="h-5 w-5 shrink-0 text-flare" />
              </div>
              <p className="wonk mt-3 font-display text-[15px] italic text-ink/70">For the fitting room</p>
              <dl className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
                {SIZES.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between py-3.5">
                    <dt className="text-[13px] font-semibold text-ink/70">{k}</dt>
                    <dd className="font-display text-[1.9rem] leading-none">{v}</dd>
                  </div>
                ))}
              </dl>
              <Barcode className="mt-7 h-11 w-full text-ink" />
              <div className="mt-2 flex justify-between gap-4 text-[11px] font-semibold text-ink/60">
                <span>ZACA-2026</span>
                <span>Care: never tone down</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Fitting() {
  return (
    <section aria-labelledby="book-for" className="relative overflow-hidden bg-flare text-bone">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 pb-24 md:grid-cols-12 md:px-10 md:pb-32">
        <div className="md:col-span-5">
          <HangTag />
          <p className="wonk mx-auto mt-8 max-w-[300px] text-center font-display text-[1.05rem] italic text-bone md:mx-0 md:ml-[8%]">
            Sizes for wardrobe and styling teams. Give it a nudge.
          </p>
        </div>

        <div className="pt-6 md:col-span-6 md:col-start-7 md:pt-32">
          <h2
            id="book-for"
            className="font-display text-[clamp(2.8rem,6.4vw,6.2rem)] leading-[0.92] tracking-[-0.03em]"
          >
            Book Dominic for
          </h2>
          <ul className="mt-10 border-t border-bone/35">
            {SERVICES.map((s) => (
              <li key={s.title} className="group border-b border-bone/35 py-5 md:py-6">
                <p className="font-display text-[clamp(1.6rem,2.7vw,2.5rem)] leading-tight tracking-[-0.01em] transition-transform duration-300 group-hover:translate-x-2">
                  {s.title}
                </p>
                <p className="mt-1 text-[15px] text-bone">{s.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
