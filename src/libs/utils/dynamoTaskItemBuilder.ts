export const buildTaskItem = (
  taskId: string,
  title: string,
  status: string,
  description?: string
) => {
  const timestamp = new Date().toISOString();

  return {
    taskId: { S: taskId },
    title: { S: title },
    description: description ? { S: description } : undefined,
    status: { S: status },
    createdAt: { S: timestamp },
    updatedAt: { S: timestamp },
  };
};
