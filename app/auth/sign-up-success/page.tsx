export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xl">
        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden border border-white/10 bg-black/40 p-8 backdrop-blur-md rounded-none">
            <div className="absolute left-0 top-0 h-[2px] w-full opacity-50" />
            <div className="mb-2 text-center text-2xl font-black uppercase tracking-widest text-white">
              Thank You For Signing Up
            </div>
            <div className="text-center text-sm font-medium tracking-wide text-zinc-400">
              Check your email to confirm your account.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
