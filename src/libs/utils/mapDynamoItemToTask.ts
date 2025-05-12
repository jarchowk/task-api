import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { Task } from "@functions/types";

export const mapDynamoItemToTask = (
  item: Record<string, AttributeValue>
): Task => {
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
