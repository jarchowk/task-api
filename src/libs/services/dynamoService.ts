import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import AWSXRay from "aws-xray-sdk";

const dynamo = AWSXRay.captureAWSv3Client(
  new DynamoDBClient({ region: "us-east-1" })
);

export const getItem = async (tableName: string, key: Record<string, any>) => {
  try {
    const result = await dynamo.send(
      new GetItemCommand({
        TableName: tableName,
        Key: key,
      })
    );

    if (!result.Item) {
      throw new Error("Item not found");
    }

    return result.Item;
  } catch (error) {
    console.error("DynamoDB Error:", error);
    throw new Error("Failed to retrieve item from DynamoDB");
  }
};

export const getAll = async (
  tableName: string
): Promise<Record<string, any>[]> => {
  try {
    const result = await dynamo.send(
      new ScanCommand({
        TableName: tableName,
      })
    );

    return result.Items || [];
  } catch (error) {
    console.error("DynamoDB Error:", error);
    throw new Error("Failed to retrieve tasks from DynamoDB");
  }
};

export const putItem = async (tableName: string, item: Record<string, any>) => {
  try {
    await dynamo.send(
      new PutItemCommand({
        TableName: tableName,
        Item: item,
      })
    );
  } catch (error) {
    console.error("DynamoDB Error:", error);
    throw new Error("Failed to save item to DynamoDB");
  }
};

export const updateItem = async (
  tableName: string,
  key: Record<string, any>,
  updateExpression: string,
  expressionAttributeNames: Record<string, string>,
  expressionAttributeValues: Record<string, any>
) => {
  try {
    await dynamo.send(
      new UpdateItemCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );
  } catch (error) {
    console.error("DynamoDB Error:", error);
    throw new Error("Failed to update item in DynamoDB");
  }
};

export const deleteItem = async (
  tableName: string,
  key: Record<string, any>,
  conditionExpression?: string
) => {
  try {
    await dynamo.send(
      new DeleteItemCommand({
        TableName: tableName,
        Key: key,
        ConditionExpression: conditionExpression,
      })
    );
  } catch (error) {
    console.error("DynamoDB Error:", error);
    throw new Error("Failed to delete item from DynamoDB");
  }
};
