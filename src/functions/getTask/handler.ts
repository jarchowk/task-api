import middy from "@middy/core";
import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import { APIGatewayProxyEvent } from "aws-lambda";

import { formatJSONResponse } from "@libs/api-gateway";
import { getTask } from "@libs/services/taskService";
import { zodPathValidator } from "@libs/middleware/zodPathValidator";
import { zodErrorHandler } from "@libs/middleware/zodErrorHandler";
import { mapDynamoItemToTask } from "@libs/utils/mapDynamoItemToTask";
import { Task } from "@functions/types";
import { taskIdSchema } from "@functions/schemas";

const logger = new Logger({
  persistentLogAttributes: {
    service: "task-api",
    functionName: "getTask",
  },
});
const tracer = new Tracer();

const baseHandler: AWSLambda.Handler = async (event: APIGatewayProxyEvent) => {
  const taskId = event.pathParameters?.taskId;

  const segment = tracer.getSegment();
  const subsegment = segment.addNewSubsegment("DynamoDB.getTask");

  try {
    const dynamoItem = await getTask(taskId);
    subsegment.close();
    const task: Task = mapDynamoItemToTask(dynamoItem);

    return formatJSONResponse({
      message: "Task retrieved successfully",
      task,
    });
  } catch (error) {
    subsegment.addError(error);
    subsegment.close();
    logger.error("Error retrieving task:", { error });
    return {
      statusCode: 404,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

// Attach middleware
export const main = middy(baseHandler)
  .use(zodPathValidator(taskIdSchema))
  .use(zodErrorHandler())
  .use(captureLambdaHandler(tracer));
