import { mapDynamoItemToTask } from "@libs/utils/mapDynamoItemToTask";

describe("mapDynamoItemToTask", () => {
  it("should map a DynamoDB item to a Task object", () => {
    const dynamoItem = {
      taskId: { S: "12345" },
      title: { S: "Test Task" },
      description: { S: "A test task description" },
      status: { S: "pending" },
      createdAt: { S: "2025-05-10T12:00:00Z" },
      updatedAt: { S: "2025-05-10T12:00:00Z" },
    };

    const task = mapDynamoItemToTask(dynamoItem);

    expect(task).toEqual({
      taskId: "12345",
      title: "Test Task",
      description: "A test task description",
      status: "pending",
      createdAt: "2025-05-10T12:00:00Z",
      updatedAt: "2025-05-10T12:00:00Z",
    });
  });
});
