"use client"

import { useState, useEffect } from "react"
import { RotateCw, Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectFormModal } from "@/components/project-form-modal"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { deleteProjectAction, type Project, type DeleteProjectState } from "@/app/dashboard/projects/project-actions"
import { useActionState, useTransition } from "react"
import { useProjectsCache } from "@/components/projects-cache-provider"

export default function ProjectsPage() {
  const { projects, loading, error, loadProjects } = useProjectsCache()
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  const [deleteState, deleteAction, isDeleting] = useActionState<DeleteProjectState, string>(deleteProjectAction, {
    message: "",
    success: false,
  })
  const [isPendingTransition, startTransition] = useTransition()

  // Load projects when component mounts
  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  // Handle successful deletion
  useEffect(() => {
    if (deleteState.success) {
      setShowDeleteConfirm(false)
      setProjectToDelete(null)
      loadProjects(true) // Force refresh after deletion
    }
  }, [deleteState.success, loadProjects])

  const handleAddProjectClick = () => {
    setEditingProject(null)
    setShowProjectModal(true)
  }

  const handleEditProjectClick = (project: Project) => {
    setEditingProject(project)
    setShowProjectModal(true)
  }

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      startTransition(() => deleteAction(projectToDelete))
    }
  }

  const handleProjectModalSuccess = () => {
    loadProjects(true) // Force refresh after add/edit success
  }

  const handleRefresh = () => {
    loadProjects(true) // Force refresh
  }

  return (
    <div className="flex-1 p-4 sm:px-6 sm:py-0 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Proyectos</h1>
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

      <p className="text-muted-foreground">Aquí puedes gestionar tus proyectos.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading && projects.length === 0 ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
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
        ) : error ? (
          <p className="col-span-full text-center text-red-500">Error al cargar proyectos: {error}</p>
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Estado: {project.status}</p>
                <p className="text-sm text-muted-foreground">
                  Fecha de entrega: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "N/A"}
                </p>
                <div className="flex items-center gap-2">
                  <Progress value={project.progress} className="w-full" />
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditProjectClick(project)}>
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(project.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No hay proyectos disponibles.</p>
        )}
      </div>

      <ProjectFormModal
        open={showProjectModal}
        onOpenChange={setShowProjectModal}
        project={editingProject}
        onSuccess={handleProjectModalSuccess}
      />

      <DeleteConfirmationModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que quieres eliminar el proyecto "${
          projects.find((p) => p.id === projectToDelete)?.name || "este proyecto"
        }"? Esta acción no se puede deshacer.`}
        isConfirming={isDeleting || isPendingTransition}
      />
    </div>
  )
}
