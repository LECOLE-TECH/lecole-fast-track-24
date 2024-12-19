import { Box } from "lucide-react"
import { Link, useNavigate, useSearchParams } from "react-router"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/components/ui/sidebar"
import { TRACK_ONE_CONSTANTS } from "~/utils/constant"

// Menu items.
const items = [
  {
    title: "Products",
    url: `/track-one?tab=${TRACK_ONE_CONSTANTS.PRODUCT_TAB}`,
    icon: Box
  }
]

export function AppSidebar() {
  const [searchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())
  const navigate = useNavigate()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel
            className="cursor-pointer"
            onClick={() => navigate("/")}
          >
            LECOLE AI
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = item.url.includes(params.tab)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
