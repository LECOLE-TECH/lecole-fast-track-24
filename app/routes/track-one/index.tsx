import type { Route } from "../track-one/+types";

import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track One" }];
}

export default function TrackOne() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
