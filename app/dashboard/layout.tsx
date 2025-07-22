import type React from "react"
import { Suspense } from "react"
import Link from "next/link"
import { MountainIcon, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardNav } from "@/components/dashboard-nav"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SidebarUserMenu } from "@/components/user-menu"
import { DashboardHeader } from "@/components/dashboard-header"
import { Toaster } from "@/components/ui/toaster"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Add a small delay to ensure session is available
  await new Promise((resolve) => setTimeout(resolve, 50))

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  console.log("Dashboard layout auth check:", {
    hasUser: !!user,
    userId: user?.id,
    error: error?.message,
  })

  if (!user || error) {
    console.log("Dashboard layout: Redirecting to signin due to no user or error")
    redirect("/?signin=true")
  }

  // Double-check that we have a valid session
  try {
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("full_name, address, phone_number, age, profile_status") // Fetch all profile fields
      .eq("user_id", user.id)
      .single()

    // If profile query fails, the session might not be valid
    if (profileError || !profile) {
      console.log("Dashboard layout: Profile not found or error, redirecting to signin", profileError)
      redirect("/?signin=true")
    }

    const { data: userRolesData } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id)

    const userRoles = (userRolesData?.map((ur) => ur.roles?.name).filter(Boolean) as string[]) || []
    const userFullName = profile?.full_name || user.email
    const userEmail = user.email

    console.log("Dashboard layout: User authenticated successfully", {
      profileStatus: profile.profile_status,
      hasFullName: !!profile.full_name,
    })

    return (
      <Suspense>
        <div className="grid min-h-screen w-full md:grid-cols-[155px_1fr] lg:grid-cols-[215px_1fr]">
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <MountainIcon className="h-6 w-6" />
                  <span className="">ProjeX</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <DashboardNav />
              </div>
              <div className="mt-auto p-4 border-t">
                <SidebarUserMenu userFullName={userFullName} userEmail={userEmail} userRoles={userRoles} />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0">
                  <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                      <MountainIcon className="h-6 w-6" />
                      <span className="">ProjeX</span>
                    </Link>
                  </div>
                  <div className="flex-1 overflow-auto py-2">
                    <DashboardNav />
                  </div>
                </SheetContent>
              </Sheet>
              <DashboardHeader
                userFullName={userFullName}
                userEmail={userEmail}
                userRoles={userRoles}
                userProfile={{
                  fullName: profile.full_name || "",
                  address: profile.address || "",
                  phoneNumber: profile.phone_number || "",
                  age: profile.age || 0,
                }}
              />
            </header>
            <div className="flex-1 overflow-auto pt-[60px]">{children}</div>
          </div>
        </div>
        <Toaster />
      </Suspense>
    )
  } catch (error) {
    console.error("Dashboard layout error:", error)
    redirect("/?signin=true")
  }
}
