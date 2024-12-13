import type { Route } from "../track-three/+types";
import { Toaster } from "~/components/ui/toaster";
import { LocalDbProvider } from "./utils/context/localDbContext";
import { ToDoManager } from "./components/ToDoManager";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';



export function meta({}: Route.MetaArgs) {
  return [{ title: "Track Three" }];
}

export default function TrackThree() {

  return <DndProvider backend={HTML5Backend}>
    <LocalDbProvider>
      <Toaster></Toaster>
      <ToDoManager></ToDoManager>
    </LocalDbProvider>
  </DndProvider>

}
