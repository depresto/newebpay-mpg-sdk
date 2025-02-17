import NewebpayClient from "../newebpay.client";

const merchantId = process.env.TEST_MERCHANT_ID || "";
const hashKey = process.env.TEST_HASH_KEY || "";
const hashIV = process.env.TEST_HASH_IV || "";

describe("MPG API", () => {
  let client: NewebpayClient;

  beforeEach(() => {
    client = new NewebpayClient({
      merchantId,
      hashKey,
      hashIV,
      env: "sandbox",
    });
  });

  test("should refund eWallet", async () => {
    const data = await client.refundEWallet({
      MerchantOrderNo: "1739512946019534",
      Amount: 1500,
      PaymentType: "LINEPAY",
    });

    console.log(data);
    expect(data).toBeDefined();
  });
});
