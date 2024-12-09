import Header from "~/components/ui/header";
import type { Route } from "../track-one/+types";
import Footer from "~/components/ui/footer";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track One" }];
}

export default function TrackOne() {
  return (
    <div>
      <Header />
      check in
      <Footer />
    </div>
  );
}
