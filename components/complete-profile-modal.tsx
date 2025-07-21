"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionState, useTransition, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfileAction, type ProfileState } from "@/app/auth/actions"
import { profileSchema } from "@/lib/schemas"
import type { z } from "zod"

interface CompleteProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: () => void
  onSkip?: () => void
  defaultValues?: z.infer<typeof profileSchema>
}

export function CompleteProfileModal({
  open,
  onOpenChange,
  onComplete,
  onSkip,
  defaultValues,
}: CompleteProfileModalProps) {
  const [state, formAction, isPending] = useActionState<ProfileState, z.infer<typeof profileSchema>>(
    updateProfileAction,
    { message: "" },
  )
  const [isPendingTransition, startTransition] = useTransition()

  // Local state to manage the success message display
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues,
  })

  // Effect to handle form reset and success message display when modal opens/closes
  useEffect(() => {
    if (open) {
      // When modal opens, reset form with default values and hide success message
      reset(defaultValues)
      setShowSuccessMessage(false)
    }
  }, [open, defaultValues, reset])

  // Effect to show success message and trigger auto-close after successful submission
  useEffect(() => {
    if (state.success) {
      setShowSuccessMessage(true)
      const timer = setTimeout(() => {
        onComplete?.() // Call onComplete to close the modal from parent
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [state.success, onComplete])

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      // When dialog is closing, reset form and clear success message
      reset()
      setShowSuccessMessage(false)
    }
    onOpenChange(isOpen)
  }

  const handleSkip = () => {
    reset()
    setShowSuccessMessage(false) // Clear success message on skip
    onSkip?.()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit((data) => startTransition(() => formAction(data)))}>
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>Please provide some additional information to complete your profile.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
              {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" {...register("phoneNumber")} />
              {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" {...register("age")} />
              {errors.age && <p className="text-xs text-red-500">{errors.age.message}</p>}
            </div>
            {/* Display messages based on local state or action state */}
            {showSuccessMessage && state?.success && <p className="text-xs text-green-600">{state.message}</p>}
            {!showSuccessMessage && state?.message && !state.success && (
              <p className="text-xs text-red-500">{state.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleSkip} disabled={isPending || isPendingTransition}>
              Skip for Now
            </Button>
            <Button type="submit" disabled={isPending || isPendingTransition}>
              {isPending || isPendingTransition ? "Saving..." : "Save Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
