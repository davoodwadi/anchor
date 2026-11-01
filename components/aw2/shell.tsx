import Link from "next/link";
import { cn } from "@/lib/utils";
import { Atmosphere } from "./atmosphere";

/** Shared class strings for the Mind Place UI layer. */
export const aw = {
  chip: "inline-flex items-center gap-2.5 bg-[rgba(30,32,31,.7)] hover:bg-[rgba(46,49,47,.8)] px-3 py-2 font-ui font-medium text-[17px] uppercase tracking-[.06em] text-aw-text",
  kicker: "aw-kicker !text-[14px] text-aw-text-3",
  label: "font-ui font-medium text-[14px] tracking-[.16em] uppercase text-aw-text-3",
  groupTitle:
    "flex gap-3.5 font-ui font-medium text-[16px] tracking-[.16em] uppercase text-aw-text-2 mb-1.5 border-0 pb-0",
  item: "relative flex items-baseline gap-2.5 w-full text-left py-1 pl-4 font-ui font-medium text-[19px] leading-snug tracking-[.02em] uppercase",
  itemIdle: "text-aw-text-2 hover:text-aw-text",
  itemOn:
    "text-aw-text before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-aw-text",
  itemMeta:
    "ml-auto pl-2 text-[15px] tracking-[.06em] text-aw-text-3 whitespace-nowrap",
  action:
    "inline-flex items-center gap-2.5 font-ui font-medium text-[19px] uppercase tracking-[.05em] text-aw-text-2 hover:text-aw-text disabled:opacity-35 disabled:hover:text-aw-text-2",
  button:
    "inline-flex items-center gap-3 border border-aw-sage text-aw-sage hover:bg-aw-sage hover:text-aw-bg px-4 py-2.5 font-ui font-medium text-[20px] uppercase tracking-[.06em] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-aw-sage",
  input:
    "w-full bg-transparent border-0 border-b border-aw-text-3 focus:border-aw-sage outline-none font-prose text-[20px] text-aw-text placeholder:text-[#4f5551] pt-2 pb-2.5",
  fieldLabel:
    "font-ui font-medium text-[14px] tracking-[.16em] uppercase text-aw-text-2",
  display: "font-display font-normal tracking-normal text-aw-sage leading-[.9]",
  stage: "md:border-l md:border-white/20 md:pl-9",
  /** Left column that stays put while the page (usually a long paper) scrolls. */
  side: "md:sticky md:top-6 md:self-start md:max-h-[calc(100svh-3rem)] md:overflow-y-auto md:overscroll-contain md:[scrollbar-width:thin] md:pr-2",
};

/** Full-page wrapper: lamp-lit desk or plain dark, with grain and vignette. */
export function AwPage({
  variant = "desk",
  shade = true,
  children,
}: {
  variant?: "desk" | "dark";
  shade?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative min-h-svh text-aw-text font-ui selection:bg-aw-sage selection:text-aw-bg",
        variant === "desk"
          ? "aw-desk"
          : "bg-[radial-gradient(ellipse_70%_45%_at_50%_30%,rgba(149,169,157,.10),transparent_70%),linear-gradient(#101413,#0b0c0c_70%)]",
      )}
    >
      {variant === "desk" && shade && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(8,8,8,.96)_0%,rgba(8,8,8,.86)_28%,rgba(8,8,8,.25)_56%,transparent_74%)] max-xl:bg-[rgba(8,8,8,.7)]"
        />
      )}
      <Atmosphere />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/** Top bar: left / centre / right slots. */
export function AwTopBar({
  left,
  mid,
  right,
}: {
  left?: React.ReactNode;
  mid?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header className="grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:px-10 py-5">
      <div className="justify-self-start">
        {left ?? (
          <Link
            href="/"
            className="font-display text-[21px] tracking-[.14em] text-aw-text"
          >
            ANCHOR
          </Link>
        )}
      </div>
      <div className="hidden md:block text-center aw-kicker !text-[14px] text-aw-text-2 truncate max-w-[50vw]">
        {mid}
      </div>
      <div className="justify-self-end flex items-center gap-3">{right}</div>
    </header>
  );
}
