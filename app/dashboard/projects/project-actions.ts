"use server"

import { createClient } from "@/lib/supabase/server"
// import { revalidatePath } from "next/cache" // REMOVE THIS IMPORT
import { projectSchema } from "@/lib/schemas"
import type { z } from "zod"

export type Project = {
  id: string
  name: string
  status: "Active" | "Completed" | "Pending" | "On Hold"
  progress: number
  dueDate: string | null
  created_at: string
}

export type ProjectFormState = {
  message: string
  success: boolean
  errors?: {
    name?: string[]
    status?: string[]
    progress?: string[]
    dueDate?: string[]
  }
}

export async function getProjectsAction(): Promise<Project[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.error("User not authenticated for getProjectsAction")
    return []
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, status, progress, due_date, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status as Project["status"],
    progress: p.progress,
    dueDate: p.due_date,
    created_at: p.created_at,
  }))
}

export async function addProjectAction(
  prevState: ProjectFormState,
  formData: z.infer<typeof projectSchema>,
): Promise<ProjectFormState> {
  const validatedFields = projectSchema.safeParse(formData)

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "User not authenticated.", success: false }
  }

  const { name, status, progress, dueDate } = validatedFields.data

  const { error } = await supabase.from("projects").insert({
    user_id: user.id,
    name,
    status,
    progress,
    due_date: dueDate || null,
  })

  if (error) {
    console.error("Error adding project:", error)
    return { message: error.message, success: false }
  }

  // revalidatePath("/dashboard/projects") // REMOVE THIS LINE
  return { message: "Project added successfully!", success: true }
}

export async function updateProjectAction(
  prevState: ProjectFormState,
  formData: z.infer<typeof projectSchema>,
): Promise<ProjectFormState> {
  const validatedFields = projectSchema.safeParse(formData)

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "User not authenticated.", success: false }
  }

  const { id, name, status, progress, dueDate } = validatedFields.data

  if (!id) {
    return { message: "Project ID is required for update.", success: false }
  }

  const { error } = await supabase
    .from("projects")
    .update({
      name,
      status,
      progress,
      due_date: dueDate || null,
    })
    .eq("id", id)
    .eq("user_id", user.id) // Ensure user can only update their own projects

  if (error) {
    console.error("Error updating project:", error)
    return { message: error.message, success: false }
  }

  // revalidatePath("/dashboard/projects") // REMOVE THIS LINE
  return { message: "Project updated successfully!", success: true }
}

export type DeleteProjectState = {
  message: string
  success: boolean
}

export async function deleteProjectAction(
  prevState: DeleteProjectState,
  projectId: string,
): Promise<DeleteProjectState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "User not authenticated.", success: false }
  }

  const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", user.id) // Ensure user can only delete their own projects

  if (error) {
    console.error("Error deleting project:", error)
    return { message: error.message, success: false }
  }

  // revalidatePath("/dashboard/projects") // REMOVE THIS LINE
  return { message: "Project deleted successfully!", success: true }
}
