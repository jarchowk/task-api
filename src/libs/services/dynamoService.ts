import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import AWSXRay from "aws-xray-sdk";

export const dynamo = AWSXRay.captureAWSv3Client(
  new DynamoDBClient({ region: "us-east-1" })
);
