import { useState, type MouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/utils/cn";
import { Heart } from "./Ornaments";
import { Note } from "./Notes";

type Group = "sa" | "spare";

const TOTAL = 101; // 101M+ likes, one heart per million
const SA = 63; // Stats SA 2025 mid-year estimate: 63.1 million

const PLATFORMS = [
  {
    name: "Instagram",
    handle: "@zaca_dominic",
    href: "https://www.instagram.com/zaca_dominic/",
    figure: "139K",
    label: "followers",
    extra: "351 posts",
  },
  { name: "Facebook", handle: "Dominic Zaca", figure: "157K", label: "talking about this", extra: "302 posts" },
  { name: "YouTube", handle: "@dominiczaca", href: "https://www.youtube.com/@dominiczaca", extra: "" },
] as const satisfies ReadonlyArray<{
  name: string;
  handle: string;
  href?: string;
  figure?: string;
  label?: string;
  extra: string;
}>;

const linkOnBone =
  "font-semibold underline decoration-ink/30 underline-offset-4 transition-colors hover:text-flare hover:decoration-flare";

export function Numbers() {
  const [focus, setFocus] = useState<Group | null>(null);

  // Hover on desktop, tap on touch, Enter/Space on keyboard.
  const legend = (key: Group) => ({
    onPointerEnter: (e: ReactPointerEvent) => {
      if (e.pointerType === "mouse") setFocus(key);
    },
    onPointerLeave: (e: ReactPointerEvent) => {
      if (e.pointerType === "mouse") setFocus(null);
    },
    onClick: (e: MouseEvent) => {
      const type = (e.nativeEvent as PointerEvent).pointerType;
      if (type !== "mouse") setFocus((f) => (f === key ? null : key));
    },
    "aria-pressed": focus === key,
  });

  return (
    <section aria-labelledby="numbers" className="relative overflow-x-clip bg-bone text-ink">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:px-10 md:py-36">
        <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
          <h2
            id="numbers"
            className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.9] tracking-[-0.03em] md:col-span-7"
          >
            Who’s watching
          </h2>
          <div className="md:col-span-4 md:col-start-9">
            <p className="max-w-md text-[17px] leading-[1.65] text-ink/75">
              More than 2.3 million followers across platforms. TikTok does the heavy lifting; Instagram gets the
              looks.
            </p>
            <Note tone="bone" className="mt-6" tilt={1}>
              Figures come from your public profiles. On launch I’d refresh them and add audience demographics from
              your TikTok and Instagram insights.
            </Note>
          </div>
        </div>

        {/* Left: followers by platform. Right: the likes story, on a plate that bleeds off the page. */}
        <div className="mt-16 grid gap-y-16 md:mt-24 md:grid-cols-12 md:gap-x-10 md:gap-y-0">
          <div className="md:col-span-7 md:row-start-1">
            <p className="wonk font-display text-[clamp(7rem,33vw,19rem)] font-light italic leading-[0.78] tracking-[-0.045em] text-flare md:text-[clamp(7rem,21vw,19rem)]">
              2.2M
            </p>
            <p className="mt-6 max-w-sm text-[17px] leading-[1.5]">
              followers on TikTok, where Dominic posts as{" "}
              <a href="https://www.tiktok.com/@zacadominic" target="_blank" rel="noreferrer" className={linkOnBone}>
                @zacadominic
              </a>
              .
            </p>
          </div>

          <div className="relative -mx-6 md:col-span-5 md:col-start-8 md:row-span-2 md:row-start-1 md:mx-0 md:self-start">
            <div aria-hidden="true" className="absolute inset-y-0 left-full hidden w-screen bg-plum md:block" />
            <div className="relative bg-plum px-6 py-12 text-bone sm:px-10 md:py-14 lg:px-12">
              <p className="wonk font-display text-[clamp(4.2rem,9vw,8rem)] font-light italic leading-[0.85] tracking-[-0.03em] text-marigold">
                101M+
              </p>
              <p className="mt-3 text-[15px] text-bone/70">likes on TikTok</p>

              <div
                role="img"
                aria-label="101 hearts, one per million likes: 63 for everyone in South Africa, 38 to spare"
                className="mt-9 grid w-fit grid-cols-10 gap-[5px] sm:gap-[6px]"
              >
                {Array.from({ length: TOTAL }, (_, i) => {
                  const group: Group = i < SA ? "sa" : "spare";
                  const dim = focus !== null && focus !== group;
                  return (
                    <Heart
                      key={i}
                      className={cn(
                        "h-[15px] w-[15px] transition-[opacity,transform] duration-300 sm:h-[18px] sm:w-[18px]",
                        group === "sa" ? "text-marigold" : "text-flare",
                        dim ? "scale-75 opacity-15" : "opacity-100",
                      )}
                      style={{ transitionDelay: `${((i % 10) + Math.floor(i / 10)) * 14}ms` }}
                    />
                  );
                })}
              </div>

              <p className="mt-9 max-w-[21ch] font-display text-[clamp(1.5rem,2.3vw,2.1rem)] leading-[1.12]">
                That’s one for every person in South Africa, with 38 million to spare.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  {...legend("sa")}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors",
                    focus === "sa" ? "border-marigold bg-marigold text-plum" : "border-bone/25 hover:border-marigold",
                  )}
                >
                  <Heart className={cn("h-3.5 w-3.5", focus === "sa" ? "text-plum" : "text-marigold")} />
                  63 million South Africans
                </button>
                <button
                  type="button"
                  {...legend("spare")}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors",
                    focus === "spare" ? "border-flare bg-flare text-bone" : "border-bone/25 hover:border-flare",
                  )}
                >
                  <Heart className={cn("h-3.5 w-3.5", focus === "spare" ? "text-bone" : "text-flare")} />
                  38 million to spare
                </button>
              </div>

              <p className="mt-6 max-w-sm text-[12px] leading-relaxed text-bone/60">
                One heart is a million likes. Population: Stats SA mid-year estimate for 2025, 63.1 million.
              </p>
            </div>
          </div>

          <ul className="border-t border-ink/15 md:col-span-7 md:row-start-2 md:mr-8 md:mt-20 lg:mr-14">
            {PLATFORMS.map((p) => (
              <li key={p.name} className="border-b border-ink/15 py-6 md:py-7">
                <div className="flex items-end justify-between gap-6">
                  <div className="min-w-0">
                    <p className="font-display text-[clamp(1.9rem,2.8vw,2.6rem)] leading-none tracking-[-0.01em]">
                      {p.name}
                    </p>
                    <p className="mt-2.5 text-[14px] text-ink/70">
                      {"href" in p ? (
                        <a href={p.href} target="_blank" rel="noreferrer" className={linkOnBone}>
                          {p.handle}
                        </a>
                      ) : (
                        <>{p.handle}, public page</>
                      )}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {"figure" in p ? (
                      <>
                        <p className="wonk font-display text-[clamp(2.4rem,3.6vw,3.4rem)] font-light italic leading-none text-flare">
                          {p.figure}
                        </p>
                        <p className="mt-2 text-[14px] font-semibold">{p.label}</p>
                        <p className="text-[13px] text-ink/60">{p.extra}</p>
                      </>
                    ) : (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="wonk font-display text-[clamp(1.4rem,2vw,1.9rem)] italic leading-none underline decoration-ink/25 underline-offset-[6px] transition-colors hover:text-flare hover:decoration-flare"
                      >
                        Watch the channel
                      </a>
                    )}
                  </div>
                </div>
                {p.name === "Facebook" && (
                  <Note tone="bone" className="mt-5">
                    Your public page shows 131 followers but 157K talking about this, so the kit leads with engagement.
                    If there’s a bigger profile to cite, it goes here.
                  </Note>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
