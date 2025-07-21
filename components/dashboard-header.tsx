"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { CompleteProfileModal } from "@/components/complete-profile-modal"
import type { z } from "zod"
import type { profileSchema } from "@/lib/schemas"

interface DashboardHeaderProps {
  userFullName: string | null
  userEmail: string | null
  userRoles: string[]
  userProfile: z.infer<typeof profileSchema>
}

export function DashboardHeader({ userFullName, userEmail, userRoles, userProfile }: DashboardHeaderProps) {
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [modalKey, setModalKey] = useState(0) // New state for forcing modal remount

  const handleOpenProfileModal = () => {
    setModalKey((prevKey) => prevKey + 1) // Increment key to force remount
    setShowProfileModal(true)
  }

  const handleProfileComplete = () => {
    setShowProfileModal(false) // Close the modal
    // router.refresh() is not needed here as revalidatePath in the server action handles data re-fetching
  }

  const handleProfileSkip = () => {
    setShowProfileModal(false)
  }

  return (
    <>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Start searching here..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <Button variant="outline" size="icon" className="rounded-full bg-transparent">
        <Plus className="h-4 w-4" />
      </Button>
      <UserMenu
        userFullName={userFullName}
        userEmail={userEmail}
        userRoles={userRoles}
        onOpenProfileModal={handleOpenProfileModal} // Use the new handler
      />

      <CompleteProfileModal
        key={modalKey} // Assign the dynamic key
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        onComplete={handleProfileComplete}
        onSkip={handleProfileSkip}
        defaultValues={userProfile}
      />
    </>
  )
}
