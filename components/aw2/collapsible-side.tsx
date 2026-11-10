"use client";

import {
  createContext,
  useContext,
  useId,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/utils";
import { Key } from "./key";
import { useHotkeys } from "./use-hotkeys";

const COLLAPSED_KEY = "anchor:side-collapsed";

function readCollapsedPref() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}
const noSubscribe = () => () => {};

/** The panel only sits beside the page from this width up; below it, it stacks. */
const BREAKPOINTS = {
  md: { toggle: "max-md:hidden", hide: "md:hidden" },
  lg: { toggle: "max-lg:hidden", hide: "lg:hidden" },
};

const SideContext = createContext({
  collapsed: false,
  toggle: () => {},
  at: "md" as keyof typeof BREAKPOINTS,
});

/**
 * Page grid whose left panel can be folded away. `collapsedClassName` holds the
 * grid columns to swap in while folded. Press M or use the button to toggle.
 * Content can grow into the freed space with aw.stageWide or aw.paperWide.
 */
export function AwSplit({
  className,
  collapsedClassName,
  at = "md",
  children,
}: {
  className: string;
  collapsedClassName: string;
  at?: keyof typeof BREAKPOINTS;
  children: React.ReactNode;
}) {
  // Stored preference (read on the client only), overridden once toggled here
  const stored = useSyncExternalStore(
    noSubscribe,
    readCollapsedPref,
    () => false,
  );
  const [override, setOverride] = useState<boolean | null>(null);
  const collapsed = override ?? stored;

  const toggle = () => {
    const next = !collapsed;
    setOverride(next);
    try {
      localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
    } catch {
      // Preference just won't persist
    }
  };

  useHotkeys({ m: toggle });

  return (
    <SideContext.Provider value={{ collapsed, toggle, at }}>
      <main
        data-collapsed={collapsed ? "" : undefined}
        className={cn(
          "group/split",
          className,
          // Column gap only: the row gap still applies when the panel stacks
          collapsed && "md:gap-x-5 lg:gap-x-5 xl:gap-x-5",
          collapsed && collapsedClassName,
        )}
      >
        {children}
      </main>
    </SideContext.Provider>
  );
}

/** The left panel of an AwSplit, with its hide and show control on top. */
export function AwSide({
  as: Tag = "section",
  className,
  children,
  ...rest
}: {
  as?: "section" | "nav";
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  const { collapsed, toggle, at } = useContext(SideContext);
  const contentId = useId();

  return (
    <Tag className={cn(className, collapsed && "md:pr-0 lg:pr-0")} {...rest}>
      <button
        onClick={toggle}
        aria-expanded={!collapsed}
        aria-controls={contentId}
        title={collapsed ? "Show panel (M)" : "Hide panel (M)"}
        className={cn(
          "inline-flex items-center gap-2 mb-3 min-h-6 whitespace-nowrap font-ui font-medium text-[14px] tracking-[.16em] uppercase text-aw-text-3 hover:text-aw-text",
          BREAKPOINTS[at].toggle,
        )}
      >
        <Key>M</Key>
        {collapsed ? (
          <span className="sr-only">Show panel</span>
        ) : (
          <>
            Hide<span className="sr-only"> panel</span>
          </>
        )}
      </button>
      <div id={contentId} className={cn(collapsed && BREAKPOINTS[at].hide)}>
        {children}
      </div>
    </Tag>
  );
}
