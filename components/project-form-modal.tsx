"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addProject, updateProject, type Project } from "@/app/dashboard/projects/project-actions"
import { projectSchema } from "@/lib/schemas"
import { useToast } from "@/components/ui/use-toast"
import type { z } from "zod"

interface ProjectFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project | null
  onSuccess: (project: Project, isNew: boolean) => void
}

export function ProjectFormModal({ open, onOpenChange, project, onSuccess }: ProjectFormModalProps) {
  const { toast } = useToast()
  const isEditing = !!project
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: project?.id || undefined,
      name: project?.name || "",
      status: project?.status || "Pending",
      progress: project?.progress || 0,
      dueDate: project?.dueDate || "",
    },
  })

  const currentStatus = watch("status")

  // Auto-set progress to 100% when status is Completed
  useEffect(() => {
    if (currentStatus === "Completed") {
      setValue("progress", 100)
    }
  }, [currentStatus, setValue])

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset({
        id: project?.id,
        name: project?.name || "",
        status: project?.status || "Pending",
        progress: project?.progress || 0,
        dueDate: project?.dueDate || "",
      })
    }
  }, [open, project, reset])

  const onSubmit = async (data: z.infer<typeof projectSchema>) => {
    setIsSubmitting(true)

    try {
      console.log(`📝 CLIENT: ${isEditing ? "Updating" : "Creating"} project in database...`)

      // Update database using server action
      const result = isEditing ? await updateProject(data) : await addProject(data)

      if (!result.success) {
        console.error("Server error:", result.message)
        toast({
          title: "Error",
          description: `Failed to ${isEditing ? "update" : "create"} project: ${result.message}`,
          variant: "destructive",
        })
        return
      }

      // If successful and we have the project data
      if (result.project) {
        console.log(`✅ CLIENT: Project ${isEditing ? "updated" : "created"} successfully:`, result.project.name)

        // Close modal first
        onOpenChange(false)

        // Then update the UI with the confirmed data from the server
        setTimeout(() => {
          onSuccess(result.project!, !isEditing)

          // Show success toast
          toast({
            title: "Success",
            description: `Project ${isEditing ? "updated" : "created"} successfully.`,
          })
        }, 100)
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: `An unexpected error occurred. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isSubmitting) {
          onOpenChange(isOpen)
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project (CLIENT)" : "Add New Project (CLIENT)"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Make changes to your project here." : "Fill in the details for your new project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" placeholder="Enter project name..." {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue("status", value as any)} value={watch("status")}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input id="progress" type="number" min="0" max="100" placeholder="0" {...register("progress")} />
              {errors.progress && <p className="text-xs text-red-500">{errors.progress.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input id="dueDate" type="date" {...register("dueDate")} />
              {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
