import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { PersistedTask } from "src/tasks/tasksModel";

export const mapDynamoItemToTask = (
  item: Record<string, AttributeValue>
): PersistedTask => {
  if (!item) {
    throw new Error("Item is undefined");
  }

  return {
    taskId: item.taskId.S || "",
    title: item.title.S || "",
    description: item.description?.S || "",
    status: item.status.S || "",
    createdAt: item.createdAt.S || "",
    updatedAt: item.updatedAt.S || "",
  };
};
