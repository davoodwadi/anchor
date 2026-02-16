import { Suspense } from "react";

import ServerPage from "./serverPage";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Suspense>
      <ServerPage params={params} />
    </Suspense>
  );
}
