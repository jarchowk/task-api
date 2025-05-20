import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]),
});

export const taskIdSchema = z.object({
  taskId: z.string().uuid("Invalid Task ID format"),
});

export type taskInput = z.infer<typeof taskSchema>;
