import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import type { Route } from "../track-one/+types";
import { lazy, Suspense } from "react";

const UserTable = lazy(() => import("@/components/UserTable/UserTable"));

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track Two" }];
}

export default function TrackTwo() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <ProtectedRoute requiredRole="authenticated">
          <UserTable />
        </ProtectedRoute>
      </Suspense>
    </div>
  );
}
