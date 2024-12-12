import Header from "~/components/header";
import type { Route } from "../track-one/+types";
import Footer from "~/components/footer";
import UserList from "~/components/userList";
import { UserProvider } from "~/contexts/userContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track Two" }];
}

export default function TrackTwo() {
  return (
    <div>
      <UserProvider>
        <Header />
        <UserList />
        <Footer />
        <ToastContainer />
      </UserProvider>
    </div>
  );
}
