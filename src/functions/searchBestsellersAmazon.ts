import { APIGatewayProxyHandler } from "aws-lambda";
import { documentDB } from "../utils/dynamoDBClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const id = "698dc19d489c4e4db73e28a713eab07b";

    const response = await documentDB
      .query({
        TableName: "BestSellers",
        KeyConditionExpression: "id=:id",
        ExpressionAttributeValues: {
          ":id": id,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(response.Items),
    };
  } catch (error) {
    throw new Error(error);
  }
};
