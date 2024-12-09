import type { Route } from "../track-one/+types";
import { AdminLayout } from "~/components/common/layout";
import ProductPage from "./product-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track One" }];
}

export default function TrackOne() {
  return (
    <AdminLayout>
      <ProductPage />
    </AdminLayout>
  );
}
