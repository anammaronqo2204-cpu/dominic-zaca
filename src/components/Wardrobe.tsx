import { useState, type ReactNode } from "react";
import pearls from "@/assets/pearls.jpg";
import taffeta from "@/assets/taffeta.jpg";
import { downloadPdf } from "@/utils/pdf-generator";
import { FeatherGlyph } from "./Ornaments";
import { Note } from "./Notes";

const Title = ({ children }: { children: string }) => (
  <cite className="font-display text-[1.06em] italic">{children}</cite>
);

const LOOKS: Array<{ house: string; piece: ReactNode; confirm?: boolean }> = [
  {
    house: "Vallure Designs",
    piece: (
      <>
        A gown for Netflix’s <Title>Bridgerton</Title> Season 4 premiere in Cape Town.
      </>
    ),
  },
  {
    house: "Indoni Fashion House",
    piece: <>A custom, pearl-draped gown for the Hollywoodbets Durban July.</>,
  },
  {
    house: "Khosi Nkosi",
    piece: <>South African heritage luxury, and the house tagged in Dominic’s Instagram bio.</>,
    confirm: true,
  },
];

function Invitation() {
  return (
    <div className="paper relative mx-auto max-w-[440px] rotate-[2.5deg] px-8 py-12 text-center text-ink transition-transform duration-700 ease-out hover:-translate-y-2 hover:rotate-1 [--paper-shadow:0_34px_60px_-30px_rgba(28,16,22,.55),0_10px_20px_-12px_rgba(28,16,22,.35)] sm:px-12 sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-ink/20" />
      <p className="wonk font-display text-[1.05rem] italic text-ink/70">With the compliments of</p>
      <p className="mt-3 font-display text-[3rem] leading-none tracking-[0.04em]">Omoda</p>
      <div aria-hidden="true" className="my-7 flex items-center justify-center gap-3 text-marigold">
        <span className="h-px w-12 bg-current" />
        <FeatherGlyph className="h-5 w-5" />
        <span className="h-px w-12 bg-current" />
      </div>
      <p className="text-[13px] font-semibold">Official guest</p>
      <p className="mt-2 text-balance font-display text-[1.7rem] leading-[1.1]">Hollywoodbets Durban July</p>
      <p className="mt-1 text-[14px] text-ink/65">2026</p>
      <div className="mt-9 border-t border-dashed border-ink/30 pt-5">
        <p className="text-[12px] text-ink/60">Admit</p>
        <p className="font-display text-[1.35rem] italic">Dominic Zaca</p>
      </div>
    </div>
  );
}

export function Wardrobe() {
  const [savedBrandsPdf, setSavedBrandsPdf] = useState(false);

  const onDownloadBrands = async () => {
    await downloadPdf("brands");
    setSavedBrandsPdf(true);
    window.setTimeout(() => setSavedBrandsPdf(false), 2800);
  };

  return (
    <section aria-labelledby="wearing" className="relative overflow-x-clip bg-bone text-ink">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:px-10 md:py-36">
        <h2
          id="wearing"
          className="wonk max-w-[10em] font-display text-[clamp(3.1rem,9.6vw,10rem)] font-light italic leading-[0.9] tracking-[-0.035em]"
        >
          “Who are you wearing?”
        </h2>
        <p className="mt-8 max-w-md text-[17px] leading-[1.65] text-ink/70">
          The red-carpet question, answered by the houses that dressed Dominic.
        </p>

        <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <div className="relative mr-8 md:mr-0">
              <div className="group overflow-hidden">
                <img
                  src={pearls}
                  alt=""
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="group absolute -bottom-14 -right-8 w-[48%] overflow-hidden border-[10px] border-bone md:-bottom-20 md:-right-16">
                <img
                  src={taffeta}
                  alt=""
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              </div>
            </div>
            <Note tone="bone" className="mt-24 md:mt-28">
              More stand-ins. These frames want the real looks: the Indoni pearls at the July, the Vallure gown at the
              Bridgerton premiere.
            </Note>
          </div>

          <ul className="md:col-span-6 md:col-start-7 md:self-center">
            {LOOKS.map((l) => (
              <li key={l.house} className="group border-t border-ink/15 py-9 last:border-b">
                <p className="font-display text-[clamp(2.3rem,4.4vw,4.2rem)] leading-[0.95] tracking-[-0.02em] transition-colors duration-300 group-hover:text-flare">
                  {l.house}
                </p>
                <p className="mt-3 max-w-md text-[17px] leading-[1.6] text-ink/75">{l.piece}</p>
                {l.confirm && (
                  <Note tone="bone" className="mt-5" tilt={1}>
                    Khosi Nkosi is tagged in your bio. I’d confirm how you want that relationship described (styling,
                    ambassador, friend of the house) before publishing.
                  </Note>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-32 grid items-center gap-14 md:mt-44 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <h3 className="font-display text-[clamp(2.4rem,4.8vw,4.4rem)] leading-[0.95] tracking-[-0.02em]">
              On the guest list
            </h3>
            <p className="mt-6 max-w-md text-[17px] leading-[1.7] text-ink/75">
              Omoda, Chery’s South African automotive brand and the official vehicle partner of the Hollywoodbets
              Durban July, has extended Dominic an official invitation to the 2026 event.
            </p>
            <div className="mt-8 border-t border-ink/15 pt-6">
              <p className="text-[14px] text-ink/70">
                Sharing with a brand team, PR agency or stylist?
              </p>
              <button
                type="button"
                onClick={onDownloadBrands}
                className="mt-3 cursor-pointer bg-plum px-5 py-3 text-[14px] font-bold text-bone transition-colors hover:bg-flare"
              >
                <span aria-live="polite">
                  {savedBrandsPdf
                    ? "Downloaded Brand Affiliations PDF"
                    : "Download Brand Affiliations & Fit (PDF)"}
                </span>
              </button>
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Invitation />
          </div>
        </div>
      </div>
    </section>
  );
}
