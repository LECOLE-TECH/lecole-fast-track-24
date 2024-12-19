import React, { Suspense } from "react"
import type { Route } from "./+types"
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/sidebar"
import { useSearchParams } from "react-router"
const Products = React.lazy(() => import("./components/product")) // Lazy load Products
import { TRACK_ONE_CONSTANTS } from "~/utils/constant"
import Loading from "~/components/loading"

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track One" }]
}

export default function TrackOne() {
  const [searchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())
  const tab = params.tab || TRACK_ONE_CONSTANTS.PRODUCT_TAB

  return (
    <SidebarProvider>
      <AppSidebar />
      <section className="w-full">
        <SidebarTrigger />
        <Suspense fallback={<Loading />}>
          {tab === TRACK_ONE_CONSTANTS.PRODUCT_TAB ? <Products /> : null}
        </Suspense>
      </section>
    </SidebarProvider>
  )
}
