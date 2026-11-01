import Link from "next/link";
import { cn } from "@/lib/utils";
import { AwPage, AwTopBar, aw } from "@/components/aw2/shell";
import { Key } from "@/components/aw2/key";

/** Title-card frame shared by every /auth screen. */
export function AuthCard({
  title,
  lede,
  children,
  footer,
}: {
  title: string;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <AwPage variant="dark">
      <AwTopBar
        mid={<span className="text-aw-text-3 !text-[13px]">For instructors</span>}
        right={
          <Link
            href="/"
            className="font-ui font-medium text-[16px] uppercase tracking-[.06em] text-aw-text-2 hover:text-aw-text"
          >
            Have a quiz link?
          </Link>
        }
      />
      <div className="min-h-[calc(100svh-90px)] grid place-items-center px-4 pb-[8vh]">
        <div className="w-full max-w-[440px] text-center">
          <h1
            className={cn(
              aw.display,
              "uppercase mt-2.5 mb-3.5 [text-wrap:balance]",
              title.length > 12
                ? "text-[clamp(52px,8vw,96px)]"
                : "text-[clamp(64px,11vw,132px)]",
            )}
          >
            {title}
          </h1>
          {lede && (
            <p className="font-prose text-[17px] leading-relaxed text-aw-text-2 mx-auto mb-9 max-w-[36ch]">
              {lede}
            </p>
          )}
          {children}
          {footer && (
            <p className="mt-7 font-prose text-[16px] text-aw-text-2 [&_a]:text-aw-text [&_a]:border-b [&_a]:border-aw-text-3">
              {footer}
            </p>
          )}
        </div>
      </div>
    </AwPage>
  );
}

export function AuthField({
  id,
  label,
  aside,
  ...input
}: { id: string; label: string; aside?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-2 text-left">
      <div className="flex justify-between items-baseline gap-3">
        <label htmlFor={id} className={aw.fieldLabel}>
          {label}
        </label>
        {aside}
      </div>
      <input id={id} className={aw.input} {...input} />
    </div>
  );
}

export function AuthSubmit({
  pending,
  children,
  pendingText,
}: {
  pending: boolean;
  children: React.ReactNode;
  pendingText: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(aw.button, "justify-self-center mt-2")}
    >
      <Key className="bg-white/[.12] text-inherit">Enter</Key>
      {pending ? pendingText : children}
    </button>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="text-left font-prose text-[15px] text-[#d58c88] border-l-2 border-aw-red pl-3"
    >
      {message}
    </p>
  );
}
