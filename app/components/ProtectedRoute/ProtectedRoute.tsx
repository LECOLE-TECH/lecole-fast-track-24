import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "authenticated";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      router.push("/unauthorized");
      return;
    }
  }, [currentUser, requiredRole, router]);

  if (!currentUser) {
    return null;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};
