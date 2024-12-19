import type { Route } from "../track-one/+types"

import { LocalDatabaseProvider } from "~/hooks/useLocalDatabase"
import TodoHeader from "./components/header"
import Columns from "./components/columns"

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track Three" }]
}

export default function TrackThree() {
  return (
    <LocalDatabaseProvider>
      <div className="flex flex-col p-8 gap-4 min-h-screen">
        <TodoHeader />
        <Columns />
      </div>
    </LocalDatabaseProvider>
  )
}
