import { APIGatewayProxyEvent } from "aws-lambda";
import {
  createTaskService,
  getTaskService,
  getAllTasksService,
  updateTaskService,
  deleteTaskService,
} from "./tasksService";
import { v4 as uuidv4 } from "uuid";
import { NewTask, PersistedTask } from "./tasksModel";

export const createTaskController = async (event: APIGatewayProxyEvent) => {
  const { title, description, status } = JSON.parse(event.body || "{}");
  const taskId = uuidv4();
  const taskItem: NewTask = { title, description, status: status || "pending" };
  await createTaskService(taskItem);
  return { taskId };
};

export const getTaskController = async (
  event: APIGatewayProxyEvent
): Promise<PersistedTask> => {
  const taskId = event.pathParameters?.taskId;
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const task = await getTaskService(taskId);
  if (!task) {
    const err = new Error("Task not found");
    (err as any).statusCode = 404;
    throw err;
  }

  return task;
};

export const getAllTasksController = async (): Promise<PersistedTask[]> => {
  return await getAllTasksService();
};

export const updateTaskController = async (
  event: APIGatewayProxyEvent
): Promise<void> => {
  const taskId = event.pathParameters?.taskId;
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const updates = JSON.parse(event.body || "{}");
  await updateTaskService(taskId, updates);
};

export const deleteTaskController = async (
  event: APIGatewayProxyEvent
): Promise<void> => {
  const taskId = event.pathParameters?.taskId;
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  await deleteTaskService(taskId);
};
