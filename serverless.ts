import type { AWS } from "@serverless/typescript";

import {
  createTask,
  getTask,
  getAllTasks,
  deleteTask,
  updateTask,
} from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "task-api",
  frameworkVersion: "4",
  plugins: ["serverless-offline", "serverless-dynamodb"],
  provider: {
    name: "aws",
    runtime: "nodejs22.x",
    region: "us-east-1",
    tracing: {
      lambda: true,
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  functions: {
    getTask: {
      ...getTask,
      role: "GetTaskRole",
    },
    getAllTasks: {
      ...getAllTasks,
      role: "GetAllTasksRole",
    },
    createTask: {
      ...createTask,
      role: "CreateTaskRole",
    },
    updateTask: {
      ...updateTask,
      role: "UpdateTaskRole",
    },
    deleteTask: {
      ...deleteTask,
      role: "DeleteTaskRole",
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node22",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      },
    },
  },
  resources: {
    Resources: {
      GetTaskRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "GetTaskRole",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: "lambda.amazonaws.com",
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
          Policies: [
            {
              PolicyName: "GetTaskPolicy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: ["dynamodb:GetItem"],
                    Resource:
                      "arn:aws:dynamodb:us-east-1:194252832793:table/Tasks",
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "xray:PutTraceSegments",
                      "xray:PutTelemetryRecords",
                    ],
                    Resource: "*",
                  },
                ],
              },
            },
          ],
        },
      },
      GetAllTasksRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "GetAllTasksRole",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: "lambda.amazonaws.com",
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
          Policies: [
            {
              PolicyName: "GetAllTasksPolicy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: ["dynamodb:Scan"],
                    Resource:
                      "arn:aws:dynamodb:us-east-1:194252832793:table/Tasks",
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "xray:PutTraceSegments",
                      "xray:PutTelemetryRecords",
                    ],
                    Resource: "*",
                  },
                ],
              },
            },
          ],
        },
      },
      CreateTaskRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "CreateTaskRole",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: "lambda.amazonaws.com",
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
          Policies: [
            {
              PolicyName: "CreateTaskPolicy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: ["dynamodb:PutItem"],
                    Resource:
                      "arn:aws:dynamodb:us-east-1:194252832793:table/Tasks",
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "xray:PutTraceSegments",
                      "xray:PutTelemetryRecords",
                    ],
                    Resource: "*",
                  },
                ],
              },
            },
          ],
        },
      },
      UpdateTaskRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "UpdateTaskRole",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: "lambda.amazonaws.com",
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
          Policies: [
            {
              PolicyName: "UpdateTaskPolicy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: ["dynamodb:UpdateItem"],
                    Resource:
                      "arn:aws:dynamodb:us-east-1:194252832793:table/Tasks",
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "xray:PutTraceSegments",
                      "xray:PutTelemetryRecords",
                    ],
                    Resource: "*",
                  },
                ],
              },
            },
          ],
        },
      },
      DeleteTaskRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "DeleteTaskRole",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: "lambda.amazonaws.com",
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
          Policies: [
            {
              PolicyName: "DeleteTaskPolicy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: ["dynamodb:DeleteItem"],
                    Resource:
                      "arn:aws:dynamodb:us-east-1:194252832793:table/Tasks",
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "xray:PutTraceSegments",
                      "xray:PutTelemetryRecords",
                    ],
                    Resource: "*",
                  },
                ],
              },
            },
          ],
        },
      },
      TasksTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "Tasks",
          AttributeDefinitions: [
            { AttributeName: "taskId", AttributeType: "S" },
          ],
          KeySchema: [{ AttributeName: "taskId", KeyType: "HASH" }],
          BillingMode: "PAY_PER_REQUEST",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
