import middy from "@middy/core";
import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import { formatJSONResponse } from "@libs/api-gateway";
import { getAllTasksController } from "src/tasks/tasksController";

const logger = new Logger({
  persistentLogAttributes: {
    service: "task-api",
    functionName: "getAllTasks",
  },
});
const tracer = new Tracer();

const baseHandler: AWSLambda.Handler = async () => {
  const segment = tracer.getSegment();
  const subsegment = segment.addNewSubsegment("DynamoDB.getAllTasks");

  try {
    const tasks = await getAllTasksController();
    subsegment.close();

    return formatJSONResponse({
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    subsegment.addError(error);
    subsegment.close();
    logger.error("Error retrieving tasks:", { error });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to retrieve tasks" }),
    };
  }
};

// Attach middleware
export const main = middy(baseHandler).use(captureLambdaHandler(tracer));
