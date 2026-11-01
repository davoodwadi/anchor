/** Film grain and edge vignette drawn over the whole viewport. */
export function Atmosphere() {
  return (
    <>
      <div className="aw-vignette" aria-hidden="true" />
      <div className="aw-grain" aria-hidden="true" />
    </>
  );
}
