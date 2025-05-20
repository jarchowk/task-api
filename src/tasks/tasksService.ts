import { NewTask, PersistedTask } from "./tasksModel";
import { taskRepository } from "./tasksRepository";

export const createTaskService = async (task: NewTask): Promise<void> => {
  if (!task.status) {
    task.status = "todo";
  }

  return taskRepository.putTask(task);
};

export const getTaskService = async (
  taskId: string
): Promise<PersistedTask | null> => {
  return taskRepository.getTask(taskId);
};

export const getAllTasksService = async (): Promise<PersistedTask[]> => {
  return taskRepository.getAllTasks();
};

export const updateTaskService = async (
  taskId: string,
  updates: Partial<Pick<PersistedTask, "title" | "description" | "status">>
): Promise<void> => {
  if (Object.keys(updates).length === 0) {
    throw new Error("No updates provided");
  }

  return taskRepository.updateTask(taskId, updates);
};

export const deleteTaskService = async (taskId: string): Promise<void> => {
  return taskRepository.deleteTask(taskId);
};
