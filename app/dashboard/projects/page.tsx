"use client"

import { useState, useEffect, useRef } from "react"
import { RotateCw, Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectFormModal } from "@/components/project-form-modal"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { deleteProject, type Project } from "@/app/dashboard/projects/project-actions"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"

// Global cache outside component to persist across navigation
const projectsCache = {
  data: [] as Project[],
  lastFetched: null as number | null,
  isValid: false,
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default function ProjectsPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>(projectsCache.data)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchingRef = useRef(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Check if cache is still valid
  const isCacheValid = () => {
    if (!projectsCache.isValid || !projectsCache.lastFetched) return false
    return Date.now() - projectsCache.lastFetched < CACHE_DURATION
  }

  // Update cache
  const updateCache = (newProjects: Project[]) => {
    projectsCache.data = newProjects
    projectsCache.lastFetched = Date.now()
    projectsCache.isValid = true
    console.log("💾 CLIENT: Cache updated with", newProjects.length, "projects")
  }

  // Invalidate cache
  const invalidateCache = () => {
    projectsCache.isValid = false
    console.log("🗑️ CLIENT: Cache invalidated")
  }

  // Client-side data fetching function
  const fetchProjects = async (force = false) => {
    if (fetchingRef.current) {
      console.log("🚫 CLIENT: Already fetching, skipping duplicate request")
      return
    }

    // Check cache first unless forced
    if (!force && isCacheValid()) {
      console.log("⚡ CLIENT: Using cached data, skipping fetch")
      setProjects(projectsCache.data)
      return
    }

    fetchingRef.current = true
    console.log("📡 CLIENT: Fetching projects from client-side...")
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { data, error: fetchError } = await supabase
        .from("projects")
        .select("id, name, status, progress, due_date, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      const formattedProjects: Project[] = data.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status as Project["status"],
        progress: p.progress,
        dueDate: p.due_date,
        created_at: p.created_at,
      }))

      console.log(`✅ CLIENT: Loaded ${formattedProjects.length} projects`)
      setProjects(formattedProjects)
      updateCache(formattedProjects)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch projects"
      console.error("❌ CLIENT: Error fetching projects:", errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  // Load projects on mount - improved version to prevent double fetching
  useEffect(() => {
    console.log("🔄 CLIENT: Initial load")
    fetchProjects()
  }, []) // Empty dependency array - only run on mount

  const handleAddProjectClick = () => {
    setEditingProject(null)
    setShowProjectModal(true)
  }

  const handleEditProjectClick = (project: Project) => {
    setEditingProject(project)
    setShowProjectModal(true)
  }

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return

    try {
      setIsDeleting(true)
      console.log("🗑️ CLIENT: Deleting project from database:", projectToDelete.name)

      // Delete from database using server action
      const result = await deleteProject(projectToDelete.id)

      if (!result.success) {
        console.error("Server error:", result.message)
        toast({
          title: "Error",
          description: `Failed to delete project: ${result.message}`,
          variant: "destructive",
        })
        return
      }

      // Update local state and cache immediately
      const updatedProjects = projects.filter((p) => p.id !== projectToDelete.id)
      console.log("✅ CLIENT: Project deleted successfully - updating local state and cache")
      setProjects(updatedProjects)
      updateCache(updatedProjects)

      // Close modal
      setShowDeleteConfirm(false)
      setProjectToDelete(null)

      // Show success toast
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the project.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleProjectModalSuccess = async (project: Project, isNew: boolean) => {
    console.log(`✅ CLIENT: Project ${isNew ? "created" : "updated"} - updating local state and cache`)

    let updatedProjects: Project[]
    if (isNew) {
      // Add to local state - NO REFETCH
      updatedProjects = [project, ...projects]
    } else {
      // Update in local state - NO REFETCH
      updatedProjects = projects.map((p) => (p.id === project.id ? project : p))
    }

    setProjects(updatedProjects)
    updateCache(updatedProjects)
    console.log("📝 CLIENT: Local state and cache updated")
  }

  const handleRefresh = () => {
    console.log("🔄 CLIENT: Manual refresh requested - invalidating cache")
    invalidateCache()
    fetchProjects(true) // Force fetch
  }

  console.log(
    "🔍 CLIENT RENDER - Projects count:",
    projects.length,
    "Loading:",
    loading,
    "Cache valid:",
    isCacheValid(),
  )

  return (
    <div className="flex-1 p-4 sm:px-6 sm:py-0 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Proyectos (CACHED MODE)</h1>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} disabled={loading} className="flex items-center gap-2">
            <RotateCw className={loading ? "animate-spin h-4 w-4" : "h-4 w-4"} />
            {loading ? "Cargando..." : "Recargar"}
          </Button>
          <Button onClick={handleAddProjectClick} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Añadir Proyecto
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground">
        CACHED MODE - Direct Supabase calls with 5min cache. Total: {projects.length}
        {isCacheValid() && (
          <span className="ml-2 text-green-600">
            (Cached {Math.round((Date.now() - (projectsCache.lastFetched || 0)) / 1000)}s ago)
          </span>
        )}
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error: {error}</p>
          <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-2 bg-transparent">
            Reintentar
          </Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading && projects.length === 0 ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={`skeleton-${index}`}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{project.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado:</span>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      project.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : project.status === "Active"
                          ? "bg-blue-100 text-blue-800"
                          : project.status === "On Hold"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progreso:</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="w-full" />
                </div>

                <p className="text-sm text-muted-foreground">
                  Fecha de entrega: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "Sin fecha"}
                </p>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditProjectClick(project)}>
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(project)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No hay proyectos disponibles</p>
            <Button onClick={handleAddProjectClick} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Crear tu primer proyecto
            </Button>
          </div>
        )}
      </div>

      {showProjectModal && (
        <ProjectFormModal
          open={showProjectModal}
          onOpenChange={setShowProjectModal}
          project={editingProject}
          onSuccess={handleProjectModalSuccess}
        />
      )}

      <DeleteConfirmationModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que quieres eliminar el proyecto "${projectToDelete?.name}"? Esta acción no se puede deshacer.`}
        isConfirming={isDeleting}
      />
    </div>
  )
}
