import middy from "@middy/core";
import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import { APIGatewayProxyEvent } from "aws-lambda";

import { formatJSONResponse } from "@libs/api-gateway";
import { zodPathValidator } from "@libs/middleware/zodPathValidator";
import { zodErrorHandler } from "@libs/middleware/zodErrorHandler";
import { taskIdSchema } from "@functions/schemas";
import { getTaskController } from "src/tasks/tasksController";

const logger = new Logger({
  persistentLogAttributes: {
    service: "task-api",
    functionName: "getTask",
  },
});
const tracer = new Tracer();

const baseHandler: AWSLambda.Handler = async (event: APIGatewayProxyEvent) => {
  const segment = tracer.getSegment();
  const subsegment = segment.addNewSubsegment("DynamoDB.getTask");

  try {
    const task = await getTaskController(event);
    subsegment.close();

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
