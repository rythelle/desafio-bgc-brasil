import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "bgc",
  frameworkVersion: "2",
  plugins: [
    "serverless-esbuild",
    "serverless-dynamodb-local",
    "serverless-offline",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    lambdaHashingVersion: "20201221",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: ["*"],
      },
    ],
  },
  functions: {
    searchBestSellers: {
      handler: "./src/functions/searchBestsellersAmazon.handler",
      memorySize: 1600,
      events: [
        {
          http: {
            path: "searchBestsellersAmazon",
            method: "get",

            cors: true,
          },
        },
      ],
    },
    getBestSellers: {
      handler: "./src/functions/getBestsellersAmazon.handler",
      memorySize: 1600,
      events: [
        {
          http: {
            path: "getBestsellersAmazon",
            method: "get",

            cors: true,
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
      external: ["chrome-aws-lambda"],
    },
    dynamodb: {
      stages: ["dev", "local"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      },
    },
  },
  resources: {
    Resources: {
      bestSellersAmazon: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "BestSellers",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
