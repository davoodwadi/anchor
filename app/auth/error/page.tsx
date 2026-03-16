import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p className="border border-neon-red-600/50 bg-neon-red-950/40 px-4 py-3 text-sm font-medium text-zinc-100">
          Code error: {params.error}
        </p>
      ) : (
        <p className="text-sm font-medium text-zinc-400">
          An unspecified error occurred.
        </p>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xl">
        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden border border-white/10 bg-black/40 p-8 backdrop-blur-md">
            <div className="mb-2 text-center text-2xl font-black uppercase tracking-widest text-white">
              Something went wrong
            </div>
            <div className="text-center text-sm font-medium tracking-wide text-zinc-400">
              An error occurred during authentication.
            </div>
          </div>

          <div className="border border-white/10 bg-black/20 p-6 backdrop-blur-md">
            <Suspense>
              <ErrorContent searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
