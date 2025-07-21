"use client"

import { LogOut, Settings, User, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOutAction } from "@/app/auth/actions"
import { useTransition } from "react"

interface UserMenuProps {
  userFullName: string | null
  userEmail: string | null
  userRoles: string[]
  align?: "start" | "end" | "center"
  onOpenProfileModal?: () => void
}

export function UserMenu({ userFullName, userEmail, userRoles, align = "end", onOpenProfileModal }: UserMenuProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${userEmail}`} alt={userFullName || userEmail || "User"} />
            <AvatarFallback>{userFullName ? userFullName.charAt(0) : userEmail?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuItem className="flex flex-col items-start">
          <span className="font-medium">{userFullName || userEmail}</span>
          {userRoles.length > 0 && <span className="text-xs text-muted-foreground">Roles: {userRoles.join(", ")}</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenProfileModal}>
          <User className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => startTransition(() => signOutAction())} disabled={isPending}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isPending ? "Signing out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface SidebarUserMenuProps {
  userFullName: string | null
  userEmail: string | null
  userRoles: string[]
  onOpenProfileModal?: () => void
}

export function SidebarUserMenu({ userFullName, userEmail, userRoles, onOpenProfileModal }: SidebarUserMenuProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 p-2 h-auto">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${userEmail}`} alt={userFullName || userEmail || "User"} />
            <AvatarFallback>{userFullName ? userFullName.charAt(0) : userEmail?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-medium leading-none">{userFullName || userEmail}</p>
            {userRoles.length > 0 && <p className="text-xs text-muted-foreground">Roles: {userRoles.join(", ")}</p>}
          </div>
          <ChevronUp className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-[250px]">
        <DropdownMenuItem onClick={onOpenProfileModal}>
          <User className="mr-2 h-4 w-4" />
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => startTransition(() => signOutAction())} disabled={isPending}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isPending ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
