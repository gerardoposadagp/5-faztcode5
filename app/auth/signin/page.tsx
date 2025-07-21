"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signinAction, type SigninState } from "@/app/auth/actions"
import { signinSchema } from "@/lib/schemas"
import type { z } from "zod"

export default function SignInPage() {
  const searchParams = useSearchParams()
  const [isPendingTransition, startTransition] = useTransition()

  const [state, formAction, isPending] = useActionState<SigninState, z.infer<typeof signinSchema>>(signinAction, {
    message: "",
    success: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
  })

  const signupMessage = searchParams.get("message")

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {signupMessage && <p className="mb-4 text-sm text-green-600 text-center">{signupMessage}</p>}

          <form onSubmit={handleSubmit((data) => startTransition(() => formAction(data)))} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            {state?.message && !state.success && <p className="text-sm text-red-500 text-center">{state.message}</p>}
            {state?.success && <p className="text-sm text-green-600 text-center">{state.message}</p>}

            <Button type="submit" className="w-full" disabled={isPending || isPendingTransition}>
              {isPending || isPendingTransition ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
