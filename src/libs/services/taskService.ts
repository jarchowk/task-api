import {
  getItem,
  getAll,
  putItem,
  updateItem,
  deleteItem,
} from "./dynamoService";

const TABLE_NAME = "Tasks";

export const getTask = async (taskId: string) => {
  return getItem(TABLE_NAME, { taskId: { S: taskId } });
};

export const getAllTasks = async () => {
  return getAll(TABLE_NAME);
};

export const putTask = async (item: Record<string, any>) => {
  return putItem(TABLE_NAME, item);
};

export const updateTask = async (
  taskId: string,
  updates: { title?: string; description?: string; status?: string }
): Promise<void> => {
  const updateExpression: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  if (updates.title) {
    updateExpression.push("#title = :title");
    expressionAttributeNames["#title"] = "title";
    expressionAttributeValues[":title"] = { S: updates.title };
  }

  if (updates.description) {
    updateExpression.push("#description = :description");
    expressionAttributeNames["#description"] = "description";
    expressionAttributeValues[":description"] = { S: updates.description };
  }

  if (updates.status) {
    updateExpression.push("#status = :status");
    expressionAttributeNames["#status"] = "status";
    expressionAttributeValues[":status"] = { S: updates.status };
  }

  if (updateExpression.length === 0) {
    throw new Error("No updates provided");
  }

  return updateItem(
    TABLE_NAME,
    { taskId: { S: taskId } },
    `SET ${updateExpression.join(", ")}`,
    expressionAttributeNames,
    expressionAttributeValues
  );
};

export const deleteTask = async (taskId: string): Promise<void> => {
  return deleteItem(
    TABLE_NAME,
    { taskId: { S: taskId } },
    "attribute_exists(taskId)"
  );
};
