"use client"

import { useState, useEffect, useCallback } from "react"
import { RotateCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface Task {
  id: string
  name: string
  status: "Pendiente" | "En Progreso" | "Completada" | "Bloqueada"
  progress: number
  dueDate: string
}

// Simulate a data fetching function for tasks with a delay
const fetchTasks = async (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tasks: Task[] = [
        {
          id: "t1",
          name: "Revisar informe trimestral",
          status: "En Progreso",
          progress: 60,
          dueDate: "2025-07-25",
        },
        {
          id: "t2",
          name: "Preparar presentación para cliente",
          status: "Pendiente",
          progress: 0,
          dueDate: "2025-07-30",
        },
        {
          id: "t3",
          name: "Actualizar documentación del API",
          status: "Completada",
          progress: 100,
          dueDate: "2025-07-18",
        },
        {
          id: "t4",
          name: "Investigar nuevas herramientas de diseño",
          status: "Bloqueada",
          progress: 20,
          dueDate: "2025-08-05",
        },
        {
          id: "t5",
          name: "Planificar reunión de equipo semanal",
          status: "Pendiente",
          progress: 0,
          dueDate: "2025-07-22",
        },
        {
          id: "t6",
          name: "Desarrollar módulo de autenticación",
          status: "En Progreso",
          progress: 85,
          dueDate: "2025-08-10",
        },
      ]
      resolve(tasks)
    }, 1000) // Simulate network delay
  })
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [lastFetched, setLastFetched] = useState<number | null>(null) // Timestamp for caching

  const loadTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTasks()
      setTasks(data)
      setLastFetched(Date.now())
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
      // Optionally set an error state here
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Load tasks only if not already loaded or if a certain time has passed (simple cache invalidation)
    if (tasks.length === 0 && !lastFetched) {
      loadTasks()
    }
  }, [loadTasks, tasks.length, lastFetched])

  return (
    <div className="flex-1 p-4 sm:px-6 sm:py-0 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tareas</h1>
        <Button onClick={loadTasks} disabled={loading} className="flex items-center gap-2">
          <RotateCw className={loading ? "animate-spin h-4 w-4" : "h-4 w-4"} />
          {loading ? "Cargando..." : "Recargar"}
        </Button>
      </div>

      <p className="text-muted-foreground">Aquí puedes ver y gestionar tus tareas.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          // Skeleton loaders while loading
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
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <CardTitle>{task.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Estado: {task.status}</p>
                <p className="text-sm text-muted-foreground">Fecha de entrega: {task.dueDate}</p>
                <div className="flex items-center gap-2">
                  <Progress value={task.progress} className="w-full" />
                  <span className="text-sm font-medium">{task.progress}%</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No hay tareas disponibles.</p>
        )}
      </div>
    </div>
  )
}
