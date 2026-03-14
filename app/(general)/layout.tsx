export default function RootGeneral({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col overflow-x-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        {/* Deep red/magenta glowing aura from top center behind the Board */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-red-600/60 via-neon-red-900/20 to-black/95" />

        {/* The 3D Black Inverted Pyramid (Perfectly Symmetrical) */}
        <div className="absolute top-0 left-0 w-full h-[65vh] md:h-[80vh] z-10 drop-shadow-[0_0_80px_rgba(245,26,40,0.4)]">
          {/* Base shape - Symmetrical Pitch Black Pyramid */}
          <div
            className="absolute inset-0 bg-black shadow-2xl"
            style={{ clipPath: "polygon(-10% 0, 110% 0, 50% 85%)" }}
          />
          {/* Right Face Highlight - Thin, angled 3D slice on the far right */}
          <div
            className="absolute inset-0 bg-gradient-to-bl from-black via-zinc-800/20 to-transparent backdrop-blur-md"
            style={{ clipPath: "polygon(100% 0, 110% 0, 50% 85%)" }}
          />
        </div>

        {/* Textural vignette to increase noir atmosphere */}
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none z-20" />

        {/* Stage/stairs dark gradient fading up from the bottom */}
        {/* <div className="absolute bottom-0 w-full h-[35vh] z-30 flex flex-col justify-end"> */}
        {/* Horizontal lines to represent the stage stairs shown in the photo */}
        {/* <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0px,transparent_1px,transparent_20px,rgba(0,0,0,0.8)_21px)]" /> */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" /> */}
        {/* </div> */}
      </div>

      {/* CONTENT */}
      <main className="relative z-40 flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
