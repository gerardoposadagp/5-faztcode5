"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, ListChecks, Settings, LifeBuoy, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Proyectos", icon: Briefcase, url: "/dashboard/projects" },
  { title: "Tareas", icon: ListChecks, url: "/dashboard/tasks" },
  { title: "Ajustes", icon: Settings, url: "/dashboard/settings" },
  { title: "Soporte", icon: LifeBuoy, url: "/dashboard/support" },
  { title: "Admon usuarios", icon: Users, url: "/dashboard/user-management" },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
      {menuItems.map((item) => (
        <Link
          key={item.title}
          href={item.url}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === item.url && "bg-muted text-primary",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
