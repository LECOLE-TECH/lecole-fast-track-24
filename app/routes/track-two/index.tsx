import Header from "~/components/header";
import type { Route } from "../track-one/+types";
import Footer from "~/components/footer";
import UserList from "~/components/userList";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track Two" }];
}

export default function TrackTwo() {
  return (
    <div>
      <Header />
      <UserList />
      <Footer />
    </div>
  );
}
