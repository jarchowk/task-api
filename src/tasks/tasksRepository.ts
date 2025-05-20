import {
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { dynamo } from "@libs/services/dynamoService";
import { NewTask, PersistedTask } from "./tasksModel";

const TABLE_NAME = "Tasks";

export const taskRepository = {
  async putTask(task: NewTask): Promise<void> {
    await dynamo.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(task),
      })
    );
  },

  async getTask(taskId: string): Promise<PersistedTask | null> {
    const result = await dynamo.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ taskId }),
      })
    );

    if (!result.Item) return null;
    return unmarshall(result.Item) as PersistedTask;
  },

  async getAllTasks(): Promise<PersistedTask[]> {
    const result = await dynamo.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );

    return (result.Items ?? []).map(
      (item) => unmarshall(item) as PersistedTask
    );
  },

  async updateTask(
    taskId: string,
    updates: Partial<Pick<PersistedTask, "title" | "description" | "status">>
  ): Promise<void> {
    const updateExpressionParts: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (updates.title) {
      updateExpressionParts.push("#title = :title");
      expressionAttributeNames["#title"] = "title";
      expressionAttributeValues[":title"] = updates.title;
    }

    if (updates.description) {
      updateExpressionParts.push("#description = :description");
      expressionAttributeNames["#description"] = "description";
      expressionAttributeValues[":description"] = updates.description;
    }

    if (updates.status) {
      updateExpressionParts.push("#status = :status");
      expressionAttributeNames["#status"] = "status";
      expressionAttributeValues[":status"] = updates.status;
    }

    if (updateExpressionParts.length === 0) {
      throw new Error("No valid updates provided.");
    }

    await dynamo.send(
      new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ taskId }),
        UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
      })
    );
  },

  async deleteTask(taskId: string): Promise<void> {
    await dynamo.send(
      new DeleteItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ taskId }),
        ConditionExpression: "attribute_exists(taskId)",
      })
    );
  },
};
