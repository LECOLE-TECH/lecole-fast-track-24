import type { Route } from "../track-one/+types";

import { Button } from "~/components/ui/button";
import ProductForm from "./components/ProductForm";
import ProductManager from "./components/ProductManagers";
import { AlertContextProvider } from "./context/AlertContext";
import AlertPopUp from "./components/AlertPopup";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track One" }];
}

export default function TrackOne() {
  return (
    <AlertContextProvider>
      <div className="container mx-auto px-4">
        <AlertPopUp></AlertPopUp>
        <h1 className="text-center"> Tracks 1 </h1>
        <ProductManager></ProductManager>
      </div>
    </AlertContextProvider>
  );
}
