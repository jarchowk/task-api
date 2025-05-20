import middy from "@middy/core";
import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import { APIGatewayProxyEvent } from "aws-lambda";

import { formatJSONResponse } from "@libs/api-gateway";
import { safeJsonBodyParser } from "@libs/middleware/safeJsonBodyParser";
import { zodBodyValidator } from "@libs/middleware/zodBodyValidator";
import { zodErrorHandler } from "@libs/middleware/zodErrorHandler";
import { taskSchema, taskInput } from "@functions/schemas";
import { createTaskController } from "src/tasks/tasksController";

const logger = new Logger({
  persistentLogAttributes: {
    service: "task-api",
    functionName: "createTask",
  },
});
const tracer = new Tracer();

const baseHandler: AWSLambda.Handler = async (
  event: APIGatewayProxyEvent & { body: taskInput }
) => {
  const segment = tracer.getSegment();
  const subsegment = segment.addNewSubsegment("DynamoDB.putTask");

  try {
    const { taskId } = await createTaskController(event);
    subsegment.close();
    return formatJSONResponse({
      message: "Task created successfully",
      taskId,
    });
  } catch (error) {
    subsegment.addError(error);
    subsegment.close();
    logger.error("DynamoDB Error", { error });
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: error.message || "Failed to create task",
      }),
    };
  }
};

// Attach middleware
export const main = middy(baseHandler)
  .use(captureLambdaHandler(tracer))
  .use(safeJsonBodyParser())
  .use(zodBodyValidator(taskSchema))
  .use(zodErrorHandler());
