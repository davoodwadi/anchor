import { AwPage, AwTopBar, aw } from "@/components/aw2/shell";
import { cn } from "@/lib/utils";

export const metadata = { title: "Anchor icon candidates" };

const CANDIDATES = [
  {
    id: "current",
    name: "Current",
    src: "/icon.svg",
    note: "The stock anchor in the old neon red. Here for comparison.",
  },
  {
    id: "a",
    name: "A  Monogram",
    src: "/logo-candidates/a-monogram.svg",
    note: "A heavy condensed A in sage, cut like the headline type, on near-black. Reads clearly at 16px.",
  },
  {
    id: "b",
    name: "B  Circled answer",
    src: "/logo-candidates/b-circled-answer.svg",
    note: "a) with the letter circled in pen on paper, exactly the mark a student makes on the quiz sheet.",
  },
  {
    id: "c",
    name: "C  Anchor, redrawn",
    src: "/logo-candidates/c-anchor-sage.svg",
    note: "Keeps the anchor people already know, redrawn with heavier square strokes in sage on black.",
  },
  {
    id: "d",
    name: "D  Keycap",
    src: "/logo-candidates/d-keycap.svg",
    note: "The A as a key chip, like the keyboard hints throughout the app.",
  },
  {
    id: "e",
    name: "E  Manuscript",
    src: "/logo-candidates/e-manuscript.svg",
    note: "A tilted typed page, ticked in the margin. The most literal; it turns into a pale card at 16px.",
  },
  {
    id: "f",
    name: "F  Monogram, ticked",
    src: "/logo-candidates/f-monogram-tick.svg",
    note: "The sage A with a hand-drawn tick beside it: the headline type plus the grader's mark.",
  },
];

export default function LogoPreviewPage() {
  return (
    <AwPage variant="dark">
      <AwTopBar mid="Icon candidates" />
      <main className="max-w-[1100px] mx-auto px-4 pb-20">
        <div className={aw.kicker}>Anchor favicon</div>
        <h1 className={cn(aw.display, "text-[clamp(56px,8vw,104px)] mt-1.5 mb-3")}>
          ICON CANDIDATES
        </h1>
        <p className="font-prose text-[17px] leading-relaxed text-aw-text-2 max-w-[62ch] mb-10">
          Each is shown large, at real tab sizes (32 and 16 pixels), and in a
          browser tab on dark and light chrome. The tab is where it matters
          most: pick the one you can still recognise there.
        </p>

        <ol className="grid gap-px bg-aw-line border border-aw-line">
          {CANDIDATES.map((c) => (
            <li
              key={c.id}
              className={cn(
                "bg-aw-bg grid gap-6 p-6 md:grid-cols-[180px_1fr] items-center",
                c.id === "current" && "opacity-80",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt="" width={180} height={180} className="size-[120px] md:size-[180px]" />
              <div className="grid gap-4">
                <div>
                  <h2 className="font-display font-normal normal-case tracking-normal border-0 pb-0 mb-1 text-[30px] leading-none text-aw-text whitespace-pre">
                    {c.name}
                  </h2>
                  <p className="font-prose text-[16px] text-aw-text-2 max-w-[60ch]">{c.note}</p>
                </div>

                <div className="flex flex-wrap items-end gap-5">
                  {[64, 32, 16].map((s) => (
                    <figure key={s} className="grid justify-items-center gap-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.src} alt="" width={s} height={s} style={{ width: s, height: s }} />
                      <figcaption className="font-ui text-[12px] tracking-[.1em] text-aw-text-3">
                        {s}px
                      </figcaption>
                    </figure>
                  ))}

                  <Tab src={c.src} dark />
                  <Tab src={c.src} />
                </div>
              </div>
            </li>
          ))}
        </ol>

        <p className="font-prose text-[15px] text-aw-text-3 mt-8">
          Files are in <code className="font-typed text-aw-text-2">public/logo-candidates/</code>. The
          chosen one replaces <code className="font-typed text-aw-text-2">app/icon.svg</code>.
        </p>
      </main>
    </AwPage>
  );
}

/** A mock browser tab at real favicon size. */
function Tab({ src, dark = false }: { src: string; dark?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-end px-2 pt-2 rounded-t-md",
        dark ? "bg-[#202124]" : "bg-[#dee1e6]",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 w-[200px] h-[34px] px-3 rounded-t-lg font-prose text-[13px]",
          dark ? "bg-[#35363a] text-[#e8eaed]" : "bg-white text-[#202124]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={16} height={16} style={{ width: 16, height: 16 }} />
        <span className="truncate">Anchor: Quiz generation</span>
      </div>
    </div>
  );
}
