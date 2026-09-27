export function Live() {
  return (
    <section aria-labelledby="live" className="relative overflow-x-clip bg-plum text-bone">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
          <h2
            id="live"
            className="font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] tracking-[-0.03em] md:col-span-7"
          >
            Live, not a screenshot
          </h2>
          <p className="max-w-md text-[17px] leading-[1.65] text-bone/75 md:col-span-4 md:col-start-9">
            Pulled straight from the official TikTok — always current.
          </p>
        </div>

        <div className="mt-14 flex justify-center">
          <blockquote
            className="tiktok-embed"
            cite="https://www.tiktok.com/@zacadominic"
            data-unique-id="zacadominic"
            data-embed-type="creator"
            style={{ maxWidth: 420, minWidth: 288 }}
          >
            <section>
              <a target="_blank" rel="noreferrer" href="https://www.tiktok.com/@zacadominic">
                @zacadominic on TikTok
              </a>
            </section>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
