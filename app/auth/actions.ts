"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { z } from "zod"
import type { signupSchema, signinSchema, profileSchema } from "@/lib/schemas"

export type SignupState = {
  message: string
  success: boolean
}

export async function signupAction(
  prevState: SignupState,
  formData: z.infer<typeof signupSchema>,
): Promise<SignupState> {
  const supabase = await createClient()

  if (formData.password !== formData.confirmPassword) {
    return { message: "Passwords do not match.", success: false }
  }

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { message: error.message, success: false }
  }

  return { message: "Account created successfully!", success: true }
}

export type SigninState = {
  message: string
  success: boolean
  needsProfileCompletion?: boolean
  userId?: string
}

export async function signinAction(
  prevState: SigninState,
  formData: z.infer<typeof signinSchema>,
): Promise<SigninState> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { message: error.message, success: false }
  }

  // Verify the session was established
  const {
    data: { user: sessionUser },
    error: sessionError,
  } = await supabase.auth.getUser()

  if (sessionError || !sessionUser) {
    return { message: "Failed to establish session. Please try again.", success: false }
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("profile_status")
    .eq("user_id", data.user.id)
    .single()

  if (profileError || !profile) {
    return { message: "User profile not found.", success: false }
  }

  // Revalidate all auth-related paths
  revalidatePath("/", "layout")
  revalidatePath("/dashboard", "layout")

  // Small delay to ensure session is fully established
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Check if profile completion is needed
  if (profile.profile_status === 0) {
    return {
      message: "Sign in successful. Please complete your profile.",
      success: true,
      needsProfileCompletion: true,
      userId: data.user.id,
    }
  } else {
    // Profile is complete, redirect to dashboard
    redirect("/dashboard")
  }
}

export type ProfileState = {
  message: string
  success?: boolean
}

export async function updateProfileAction(
  prevState: ProfileState,
  formData: z.infer<typeof profileSchema>,
): Promise<ProfileState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "User not authenticated." }
  }

  const { error } = await supabase
    .from("user_profiles")
    .update({
      full_name: formData.fullName,
      address: formData.address,
      phone_number: formData.phoneNumber,
      age: formData.age,
      profile_status: 1,
    })
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating profile:", error)
    return { message: error.message }
  }

  // Revalidate the dashboard layout
  revalidatePath("/dashboard", "layout")

  return { message: "Profile updated successfully!", success: true }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Revalidate to clear any cached auth state
  revalidatePath("/", "layout")

  redirect("/")
}
