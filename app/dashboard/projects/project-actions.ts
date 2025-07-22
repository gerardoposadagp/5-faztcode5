"use server"

import { createClient } from "@/lib/supabase/server"
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
  project?: Project // Add project data for successful add/update
}

export async function getProjectsAction(): Promise<Project[]> {
  console.log("🔍 Server: Fetching projects from database")

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

  console.log(`🔍 Server: Found ${data.length} projects`)

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status as Project["status"],
    progress: p.progress,
    dueDate: p.due_date,
    created_at: p.created_at,
  }))
}

// Direct call version for addProject
export async function addProject(formData: z.infer<typeof projectSchema>): Promise<ProjectFormState> {
  console.log("🔍 Server: Adding new project")

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

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name,
      status,
      progress,
      due_date: dueDate || null,
    })
    .select()
    .single() // Select the inserted row

  if (error) {
    console.error("Error adding project:", error)
    return { message: error.message, success: false }
  }

  console.log("🔍 Server: Project added successfully")

  const newProject: Project = {
    id: data.id,
    name: data.name,
    status: data.status as Project["status"],
    progress: data.progress,
    dueDate: data.due_date,
    created_at: data.created_at,
  }

  return { message: "Project added successfully!", success: true, project: newProject }
}

// Direct call version for updateProject
export async function updateProject(formData: z.infer<typeof projectSchema>): Promise<ProjectFormState> {
  console.log("🔍 Server: Updating project")

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

  const { data, error } = await supabase
    .from("projects")
    .update({
      name,
      status,
      progress,
      due_date: dueDate || null,
    })
    .eq("id", id)
    .eq("user_id", user.id) // Ensure user can only update their own projects
    .select() // Select the updated row
    .single()

  if (error) {
    console.error("Error updating project:", error)
    return { message: error.message, success: false }
  }

  console.log("🔍 Server: Project updated successfully")

  const updatedProject: Project = {
    id: data.id,
    name: data.name,
    status: data.status as Project["status"],
    progress: data.progress,
    dueDate: data.due_date,
    created_at: data.created_at,
  }

  return { message: "Project updated successfully!", success: true, project: updatedProject }
}

export type DeleteProjectState = {
  message: string
  success: boolean
  deletedProjectId?: string // Add deleted project ID for successful delete
}

// Direct call version for deleteProject
export async function deleteProject(projectId: string): Promise<DeleteProjectState> {
  console.log("🔍 Server: Deleting project")

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

  console.log("🔍 Server: Project deleted successfully")

  return { message: "Project deleted successfully!", success: true, deletedProjectId: projectId }
}
