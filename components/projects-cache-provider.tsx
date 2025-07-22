"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { getProjectsAction, type Project } from "@/app/dashboard/projects/project-actions"

interface ProjectsCacheContextType {
  projects: Project[]
  loading: boolean
  error: string | null
  lastFetched: number | null
  loadProjects: (force?: boolean) => Promise<void>
  updateCache: (projects: Project[]) => void
}

const ProjectsCacheContext = createContext<ProjectsCacheContextType | null>(null)

export function useProjectsCache() {
  const context = useContext(ProjectsCacheContext)
  if (!context) {
    throw new Error("useProjectsCache must be used within ProjectsCacheProvider")
  }
  return context
}

interface ProjectsCacheProviderProps {
  children: React.ReactNode
}

export function ProjectsCacheProvider({ children }: ProjectsCacheProviderProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<number | null>(null)

  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  const loadProjects = useCallback(
    async (force = false) => {
      // Check if we should use cache
      if (!force && projects.length > 0 && lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
        console.log("Using cached projects data")
        return
      }

      console.log("Fetching fresh projects data")
      setLoading(true)
      setError(null)

      try {
        const data = await getProjectsAction()
        setProjects(data)
        setLastFetched(Date.now())
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch projects")
        console.error("Failed to fetch projects:", err)
      } finally {
        setLoading(false)
      }
    },
    [projects.length, lastFetched],
  )

  const updateCache = useCallback((newProjects: Project[]) => {
    setProjects(newProjects)
    setLastFetched(Date.now())
  }, [])

  const value: ProjectsCacheContextType = {
    projects,
    loading,
    error,
    lastFetched,
    loadProjects,
    updateCache,
  }

  return <ProjectsCacheContext.Provider value={value}>{children}</ProjectsCacheContext.Provider>
}
