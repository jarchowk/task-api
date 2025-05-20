export type TaskBase = {
  title: string;
  description?: string;
  status: string;
};

export type NewTask = TaskBase;

export type PersistedTask = TaskBase & {
  taskId: string;
  createdAt: string;
  updatedAt: string;
};
