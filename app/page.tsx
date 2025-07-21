"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { MountainIcon } from "lucide-react"
import { SignupModal } from "@/components/signup-modal"
import { SigninModal } from "@/components/signin-modal"

export default function LandingPage() {
  const searchParams = useSearchParams()
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showSigninModal, setShowSigninModal] = useState(false)

  // Check if we should auto-open signin modal from URL params
  useEffect(() => {
    if (searchParams.get("signin") === "true") {
      setShowSigninModal(true)
    }
  }, [searchParams])

  const handleSwitchToSignin = () => {
    setShowSignupModal(false)
    setShowSigninModal(true)
  }

  const handleSwitchToSignup = () => {
    setShowSigninModal(false)
    setShowSignupModal(true)
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">ProjeX</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Dashboard
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Pricing
          </Link>
          <button
            onClick={() => setShowSigninModal(true)}
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Sign In
          </button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Organiza tu trabajo y tu vida, por fin.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Concéntrate, organízate y tranquilízate con ProjeX. La aplicación de gestión de proyectos y tareas
                    número 1 del mundo.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Empezar gratis
                  </button>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Contactar Ventas
                  </Link>
                </div>
              </div>
              <img
                src="/placeholder.svg?width=600&height=600"
                width="600"
                height="600"
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
      </main>

      <SignupModal open={showSignupModal} onOpenChange={setShowSignupModal} onSwitchToSignin={handleSwitchToSignin} />
      <SigninModal open={showSigninModal} onOpenChange={setShowSigninModal} onSwitchToSignup={handleSwitchToSignup} />
    </div>
  )
}
