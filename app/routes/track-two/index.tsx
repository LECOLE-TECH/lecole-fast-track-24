import Header from "~/routes/track-two/components/header"
import type { Route } from "../track-one/+types"
import Users from "./components/user"
import { SocketProvider } from "~/hooks/useSocket"

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track Two" }]
}

export default function TrackTwo() {
  return (
    <SocketProvider>
      <Header />
      <div className="max-w-screen-2xl mx-auto">
        <Users />
      </div>
    </SocketProvider>
  )
}
