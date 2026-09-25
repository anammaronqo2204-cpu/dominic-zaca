import plumes from "@/assets/plumes.jpg";
import { Note } from "./Notes";

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[13px] text-bone/60">{k}</dt>
      <dd className="mt-1 font-display text-[1.3rem] leading-snug">{v}</dd>
    </div>
  );
}

const Title = ({ children }: { children: string }) => (
  <cite className="font-display text-[1.06em] italic">{children}</cite>
);

export function Voice() {
  return (
    <section aria-labelledby="bio" className="grain relative bg-plum text-bone">
      <div className="mx-auto max-w-[1320px] px-6 pb-28 pt-20 md:px-10 md:pb-40 md:pt-32">
        <figure>
          <blockquote className="wonk relative max-w-[12.5em] font-display text-[clamp(2.2rem,5.8vw,6.25rem)] font-light italic leading-[1.02] tracking-[-0.02em]">
            <span
              aria-hidden="true"
              className="mb-1 block text-[1.5em] leading-[0.75] text-marigold md:absolute md:-left-[0.62em] md:top-[0.08em] md:mb-0 md:text-[1.4em] md:leading-none"
            >
              “
            </span>
            <p>I survived! I show you who I am and you laugh, love and cry along with me.</p>
          </blockquote>
          <figcaption className="mt-8 text-[14px] text-bone/60 md:mt-10">
            Dominic’s bio line, on every platform
          </figcaption>
        </figure>

        <div className="mt-24 grid gap-14 md:mt-36 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <div className="relative mx-3 max-w-[440px] sm:mx-auto md:mx-3">
              <div aria-hidden="true" className="absolute -inset-3 rounded-t-full border border-marigold/35" />
              <img
                src={plumes}
                alt=""
                className="relative aspect-[3/4] w-full rounded-t-full object-cover object-[72%_50%]"
              />
            </div>
            <Note className="mt-10">
              Stand-in texture. This arch is cut for your cover portrait, pulled from your own shoots.
            </Note>
          </div>

          <div className="md:col-span-6 md:col-start-7 md:pt-8">
            <h2
              id="bio"
              className="font-display text-[clamp(1.75rem,2.9vw,2.75rem)] leading-[1.12] tracking-[-0.01em]"
            >
              Media personality, MC, content creator, and one of the loudest, warmest voices in queer South Africa.
            </h2>
            <div className="mt-8 space-y-5 text-[17px] leading-[1.7] text-bone/80">
              <p>
                Dominic Zaca has built an audience of more than two million people by refusing to shrink. On TikTok,
                Instagram and YouTube, everyday life becomes appointment viewing: funny, frank, dressed to the hilt,
                and always in conversation with the community in the comments.
              </p>
              <p>
                The screen credits run from Moja Love’s LGBTQIA+ reality series <Title>The Way Ngingakhona</Title> to
                supporting roles in Showmax’s <Title>LLB</Title> and Mnet’s <Title>Udumo</Title>. Off camera, Dominic
                works as a creative director and consults on business development and marketing, so a brief lands
                with someone who reads it like a strategist and delivers it like a star.
              </p>
            </div>
            <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-bone/15 pt-7 sm:grid-cols-2">
              <Fact k="Based" v="KwaZulu-Natal and Johannesburg" />
              <Fact k="Speaks" v="English and isiZulu" />
              <Fact k="Known for" v="Maximalist fashion, worn loudly" />
              <Fact k="Stands up for" v="South Africa’s LGBTQIA+ community" />
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
