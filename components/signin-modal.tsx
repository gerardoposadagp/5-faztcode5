"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionState, useTransition, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signinAction, type SigninState } from "@/app/auth/actions"
import { signinSchema } from "@/lib/schemas"
import { CompleteProfileModal } from "@/components/complete-profile-modal"
import type { z } from "zod"

interface SigninModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToSignup?: () => void
}

export function SigninModal({ open, onOpenChange, onSwitchToSignup }: SigninModalProps) {
  const router = useRouter()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [state, formAction, isPending] = useActionState<SigninState, z.infer<typeof signinSchema>>(signinAction, {
    message: "",
    success: false,
  })

  const [isPendingTransition, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
  })

  // Handle successful signin with profile completion needed
  useEffect(() => {
    if (state.success && state.needsProfileCompletion) {
      setShowProfileModal(true)
    }
  }, [state.success, state.needsProfileCompletion])

  const handleClose = () => {
    reset()
    setShowProfileModal(false)
    onOpenChange(false)
  }

  const handleSwitchToSignup = () => {
    handleClose()
    onSwitchToSignup?.()
  }

  const handleProfileComplete = () => {
    setShowProfileModal(false)
    onOpenChange(false)
    router.push("/dashboard")
  }

  const handleProfileSkip = () => {
    setShowProfileModal(false)
    onOpenChange(false)
    router.push("/dashboard")
  }

  const handleProfileModalClose = (isOpen: boolean) => {
    if (!isOpen) {
      // If modal is closing, treat it as a skip and redirect
      handleProfileSkip()
    } else {
      setShowProfileModal(true)
    }
  }

  return (
    <>
      <Dialog open={open && !showProfileModal} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Sign In</DialogTitle>
            <DialogDescription>Enter your email and password to access your account</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => startTransition(() => formAction(data)))} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input id="signin-email" type="email" placeholder="m@example.com" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input id="signin-password" type="password" {...register("password")} />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>
              {state?.message && !state.success && <p className="text-sm text-red-500 text-center">{state.message}</p>}
              {state?.success && !state.needsProfileCompletion && (
                <p className="text-sm text-green-600 text-center">{state.message}</p>
              )}
            </div>
            <div className="space-y-4">
              <Button type="submit" className="w-full" disabled={isPending || isPendingTransition}>
                {isPending || isPendingTransition ? "Signing in..." : "Sign In"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={handleSwitchToSignup}
                  className="underline hover:text-primary"
                  disabled={isPending || isPendingTransition}
                >
                  Sign up
                </button>
              </div>
              <Button type="button" variant="outline" onClick={handleClose} className="w-full bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CompleteProfileModal
        open={showProfileModal}
        onOpenChange={handleProfileModalClose}
        onComplete={handleProfileComplete}
        onSkip={handleProfileSkip}
      />
    </>
  )
}
