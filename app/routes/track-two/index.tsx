import type { Route } from "../track-one/+types";

import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track Two" }];
}

export default function TrackTwo() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Button>Click me</Button>
    </div>
  );
}
