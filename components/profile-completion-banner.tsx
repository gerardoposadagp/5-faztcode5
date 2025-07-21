"use client"

import { useState } from "react"
import { AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CompleteProfileModal } from "@/components/complete-profile-modal"

export function ProfileCompletionBanner() {
  const [showBanner, setShowBanner] = useState(true)
  const [showModal, setShowModal] = useState(false)

  if (!showBanner) return null

  const handleComplete = () => {
    setShowModal(false)
    setShowBanner(false)
  }

  const handleSkip = () => {
    setShowModal(false)
    setShowBanner(false)
  }

  return (
    <>
      <Alert className="border-orange-200 bg-orange-50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-orange-800">
            Complete your profile to get the most out of ProjeX and unlock all features.
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setShowModal(true)}>
              Complete Profile
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowBanner(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <CompleteProfileModal
        open={showModal}
        onOpenChange={setShowModal}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    </>
  )
}
