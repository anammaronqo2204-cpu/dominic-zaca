import { SCREEN } from "@/content";
import { FeatherGlyph, WaxSeal } from "./Ornaments";
import { Note } from "./Notes";

const linkOnPlum =
  "font-semibold text-bone underline decoration-bone/30 underline-offset-4 transition-colors hover:text-marigold hover:decoration-marigold";

export function Credits() {
  return (
    <section aria-labelledby="decorated" className="grain relative overflow-hidden bg-plum text-bone">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:px-10 md:py-36">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2
              id="decorated"
              className="font-display text-[clamp(3.2rem,8vw,8rem)] leading-[0.9] tracking-[-0.03em]"
            >
              Decorated.
            </h2>
            <p className="mt-8 max-w-md text-[17px] leading-[1.7] text-bone/80">
              In November 2025, the 17th Feather Awards named Dominic Social Media Personality of the Year. The
              Feathers have championed visibility, advocacy and representation for LGBTQIA+ South Africans since
              2009.
            </p>
            <p className="mt-5 max-w-md text-[17px] leading-[1.7] text-bone/80">
              A year earlier, the SA Social Media Awards nominated Dominic for Social Media Dominance of the Year.
            </p>
            <p className="mt-8 max-w-md text-[14px] leading-relaxed text-bone/60">
              Both tagged in Dominic’s bio:{" "}
              <a href="https://www.instagram.com/feathersa/" target="_blank" rel="noreferrer" className={linkOnPlum}>
                @feathersa
              </a>{" "}
              and{" "}
              <a href="https://www.instagram.com/smawards_za/" target="_blank" rel="noreferrer" className={linkOnPlum}>
                @smawards_za
              </a>
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="relative mx-auto max-w-[640px] lg:min-h-[710px]">
              {/* The certificate */}
              <article className="paper relative z-10 w-full -rotate-2 px-7 py-12 text-center text-ink transition-transform duration-700 ease-out hover:-translate-y-2 hover:rotate-0 hover:scale-[1.015] sm:px-14 sm:py-16 lg:w-[80%]">
                <div aria-hidden="true" className="pointer-events-none absolute inset-3 border-2 border-marigold/80" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-[19px] border border-marigold/55" />
                <FeatherGlyph className="mx-auto h-9 w-9 text-marigold" />
                <p className="wonk mt-5 font-display text-[1.6rem] italic leading-none text-flare">Winner</p>
                <h3 className="mx-auto mt-4 max-w-[12ch] text-balance font-display text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.02] tracking-[-0.02em]">
                  Social Media Personality of the Year
                </h3>
                <div aria-hidden="true" className="mx-auto my-7 h-px w-20 bg-ink/25" />
                <p className="text-[14px] font-semibold">The 17th Feather Awards</p>
                <p className="mt-1 text-[13px] text-ink/65">Johannesburg, November 2025</p>
                <p className="mt-6 font-display text-[1.15rem] italic text-ink/80">Awarded to Dominic Zaca</p>
                <WaxSeal className="absolute -bottom-12 -left-3 z-20 h-28 w-28 -rotate-12 sm:-left-10 sm:h-32 sm:w-32" />
              </article>

              {/* The nomination, tucked against its corner */}
              <article className="paper relative z-20 ml-auto mt-14 w-[82%] rotate-3 border-t-[6px] border-flare px-6 py-7 text-left text-ink transition-transform duration-700 ease-out hover:-translate-y-2 hover:rotate-1 hover:scale-[1.02] sm:-mt-4 sm:w-[56%] lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:w-[44%]">
                <p className="wonk font-display text-[1.2rem] italic leading-none text-flare">Nominee</p>
                <h3 className="mt-3 text-balance font-display text-[1.6rem] leading-[1.05] tracking-[-0.01em]">
                  Social Media Dominance of the Year
                </h3>
                <p className="mt-4 text-[13px] font-semibold">SA Social Media Awards</p>
                <p className="text-[13px] text-ink/65">2024</p>
              </article>
            </div>
          </div>
        </div>

        <div className="mt-32 md:mt-40">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-[clamp(2.6rem,5.5vw,5rem)] leading-none tracking-[-0.02em]">On screen</h2>
            <Note tilt={1.4}>Room here for press clippings and outlet logos. I’d gather them with you.</Note>
          </div>
          <ul className="mt-10 border-t border-bone/15">
            {SCREEN.map((s) => {
              const character = s.role.startsWith("as ");
              return (
                <li
                  key={s.title}
                  className="group grid grid-cols-2 items-baseline gap-x-6 gap-y-3 border-b border-bone/15 py-8 md:grid-cols-12 md:py-10"
                >
                  <p className="col-span-2 font-display text-[clamp(2.1rem,4.6vw,4.4rem)] leading-[0.95] tracking-[-0.02em] transition-colors duration-300 group-hover:text-marigold md:col-span-6">
                    {s.title}
                  </p>
                  <p className="text-[15px] font-semibold md:col-span-2">{s.network}</p>
                  <p className="text-[15px] md:col-span-2">
                    <span
                      className={
                        character
                          ? "block font-display text-[1.3rem] italic leading-tight"
                          : "block font-semibold leading-tight"
                      }
                    >
                      {s.role}
                    </span>
                    <span className="text-bone/60">{s.detail}</span>
                  </p>
                  <p className="col-span-2 text-[15px] text-bone/60 md:col-span-2 md:text-right">{s.when}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
