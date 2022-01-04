import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  const response = await document
    .query({
      TableName: "users_certificates",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  const usersCertificate = response.Items[0];

  if (usersCertificate) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Certificate verified!",
        name: usersCertificate.name,
        url: `https://s3.amazonaws.com/certificates-app-bucket/${id}.pdf`,
      }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Certificate not found!",
    }),
  };
};
