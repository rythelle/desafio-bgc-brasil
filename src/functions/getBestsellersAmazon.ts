import { APIGatewayProxyHandler } from "aws-lambda";
import { documentDB } from "../utils/dynamoDBClient";
import chromium from "chrome-aws-lambda";

export const handler: APIGatewayProxyHandler = async (event) => {
  let browser = null;
  let arrayProduts: Object[] = [];

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();

    await page.goto("https://www.amazon.com.br/bestsellers");

    const newListItems = await page.evaluate(async () => {
      const nodeList = document.querySelectorAll(".a-carousel-card");

      const listItems = [...nodeList];

      return listItems.map((product) => {
        return {
          title: product.querySelector(
            ".zg-carousel-general-faceout div a span"
          ).textContent,
          price: product.querySelector(".a-row a span span").textContent,

          rating: product.querySelector(".a-icon-row a i").textContent,

          img: product.querySelector("img").src,
          link: `https://www.amazon.com.br/${product
            .querySelector(".zg-carousel-general-faceout div a")
            .getAttribute("href")}`,
        };
      });
    });

    const threeBestSellingProducts = newListItems.splice(0, 3);

    const id = "698dc19d489c4e4db73e28a713eab07b";

    threeBestSellingProducts.forEach(async (element) => {
      arrayProduts.push(element);
    });

    await documentDB
      .put({
        TableName: "BestSellers",
        Item: {
          id: id,
          products: [arrayProduts],
        },
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Updated bestsellers from Amazon in DynamoDB.",
      }),
    };
  } catch (error) {
    throw new Error(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
