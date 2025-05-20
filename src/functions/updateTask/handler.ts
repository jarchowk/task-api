import middy from "@middy/core";
import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import { APIGatewayProxyEvent } from "aws-lambda";

import { formatJSONResponse } from "@libs/api-gateway";
import { safeJsonBodyParser } from "@libs/middleware/safeJsonBodyParser";
import { zodBodyValidator } from "@libs/middleware/zodBodyValidator";
import { zodErrorHandler } from "@libs/middleware/zodErrorHandler";
import { zodPathValidator } from "@libs/middleware/zodPathValidator";
import { taskSchema, taskIdSchema, taskInput } from "@functions/schemas";
import { updateTaskController } from "src/tasks/tasksController";

const logger = new Logger({
  persistentLogAttributes: {
    service: "task-api",
    functionName: "updateTask",
  },
});
const tracer = new Tracer();

const baseHandler: AWSLambda.Handler = async (
  event: APIGatewayProxyEvent & { body: taskInput }
) => {
  const taskId = event.pathParameters?.taskId;

  const segment = tracer.getSegment();
  const subsegment = segment.addNewSubsegment("DynamoDB.updateTask");

  try {
    await updateTaskController(event);
    subsegment.close();

    return formatJSONResponse({
      message: `Task with ID ${taskId} updated successfully`,
    });
  } catch (error) {
    subsegment.addError(error);
    subsegment.close();
    logger.error("Error updating task:", { error });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to update task" }),
    };
  }
};

// Attach middleware
export const main = middy(baseHandler)
  .use(captureLambdaHandler(tracer))
  .use(safeJsonBodyParser())
  .use(zodPathValidator(taskIdSchema))
  .use(zodBodyValidator(taskSchema))
  .use(zodErrorHandler());
