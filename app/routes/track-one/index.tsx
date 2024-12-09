import Header from "~/components/ui/header";
import type { Route } from "../track-one/+types";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track One" }];
}

export default function TrackOne() {
  return (
    <div>
      <Header />
    </div>
  );
}
