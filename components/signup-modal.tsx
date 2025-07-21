"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionState, useTransition, useState } from "react"
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
import { signupAction, type SignupState } from "@/app/auth/actions"
import { signupSchema } from "@/lib/schemas"
import { CheckCircle } from "lucide-react"
import type { z } from "zod"

interface SignupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToSignin?: () => void
}

export function SignupModal({ open, onOpenChange, onSwitchToSignin }: SignupModalProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [state, formAction, isPending] = useActionState<SignupState, z.infer<typeof signupSchema>>(
    async (prevState, formData) => {
      const result = await signupAction(prevState, formData)
      if (result.success) {
        setShowSuccess(true)
      }
      return result
    },
    { message: "", success: false },
  )

  const [isPendingTransition, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  })

  const handleClose = () => {
    setShowSuccess(false)
    reset()
    onOpenChange(false)
  }

  const handleSwitchToSignin = () => {
    handleClose()
    onSwitchToSignin?.()
  }

  const handleSuccessClose = () => {
    handleClose()
    // Optionally switch to signin modal after successful signup
    onSwitchToSignin?.()
  }

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Account Created Successfully!</DialogTitle>
            <DialogDescription className="text-base">
              Your account has been created successfully. You can now sign in to access your dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col space-y-2">
            <Button onClick={handleSuccessClose} className="w-full">
              Sign In Now
            </Button>
            <Button variant="outline" onClick={handleClose} className="w-full bg-transparent">
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Account</DialogTitle>
          <DialogDescription>Enter your information to create a new account</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => startTransition(() => formAction(data)))} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" type="email" placeholder="m@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" type="password" {...register("password")} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-confirmPassword">Confirm Password</Label>
              <Input id="signup-confirmPassword" type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            {state?.message && !state.success && <p className="text-sm text-red-500 text-center">{state.message}</p>}
          </div>
          <div className="space-y-4">
            <Button type="submit" className="w-full" disabled={isPending || isPendingTransition}>
              {isPending || isPendingTransition ? "Creating account..." : "Create Account"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={handleSwitchToSignin}
                className="underline hover:text-primary"
                disabled={isPending || isPendingTransition}
              >
                Sign in
              </button>
            </div>
            <Button type="button" variant="outline" onClick={handleClose} className="w-full bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
