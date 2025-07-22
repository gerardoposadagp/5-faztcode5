"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionState, useTransition, useEffect } from "react"
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
import {
  addProjectAction,
  updateProjectAction,
  type ProjectFormState,
  type Project,
} from "@/app/dashboard/projects/project-actions"
import { projectSchema } from "@/lib/schemas"
import type { z } from "zod"

interface ProjectFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project | null // Optional project for editing
  onSuccess: () => void
}

export function ProjectFormModal({ open, onOpenChange, project, onSuccess }: ProjectFormModalProps) {
  const isEditing = !!project

  const [state, formAction, isPending] = useActionState<ProjectFormState, z.infer<typeof projectSchema>>(
    isEditing ? updateProjectAction : addProjectAction,
    { message: "", success: false },
  )
  const [isPendingTransition, startTransition] = useTransition()

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
      name: project?.name || "",
      status: project?.status || "Pending",
      progress: project?.progress || 0,
      dueDate: project?.dueDate || "",
    },
  })

  // Watch for status changes to update the progress if status becomes "Completed"
  const currentStatus = watch("status")
  useEffect(() => {
    if (currentStatus === "Completed") {
      setValue("progress", 100)
    }
  }, [currentStatus, setValue])

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

  useEffect(() => {
    if (state.success) {
      onSuccess()
      onOpenChange(false)
    }
  }, [state.success, onSuccess, onOpenChange])

  const onSubmit = (data: z.infer<typeof projectSchema>) => {
    startTransition(() => formAction(data))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Make changes to your project here." : "Fill in the details for your new project."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue("status", value as any)} value={watch("status")}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input id="progress" type="number" {...register("progress")} />
              {errors.progress && <p className="text-xs text-red-500">{errors.progress.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" {...register("dueDate")} />
              {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
            </div>
            {state?.message && !state.success && <p className="text-sm text-red-500 text-center">{state.message}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending || isPendingTransition}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isPendingTransition}>
              {isPending || isPendingTransition
                ? isEditing
                  ? "Saving..."
                  : "Adding..."
                : isEditing
                  ? "Save Changes"
                  : "Add Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
