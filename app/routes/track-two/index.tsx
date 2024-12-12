import Header from "~/components/header";
import type { Route } from "../track-one/+types";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track Two" }];
}

export default function TrackTwo() {
  return (
    <div>
      <Header />
    </div>
  );
}
