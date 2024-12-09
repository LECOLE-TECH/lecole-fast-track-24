import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/common/app-sidebar";

export const AdminLayout = function ({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-2">
        <SidebarTrigger />
        <div className="p-2">{children}</div>
      </main>
    </SidebarProvider>
  );
};
