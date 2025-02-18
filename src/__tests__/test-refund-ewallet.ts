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
      MerchantOrderNo: "17395115177210224",
      Amount: 3000,
      PaymentType: "LINEPAY",
    });

    console.log(data);
    expect(data).toBeDefined();
  });

  test("should query trade info", async () => {
    const data = await client.queryTradeInfo({
      MerchantOrderNo: "17395115177210224",
      Amt: 3000,
    });

    console.log(data);
    expect(data).toBeDefined();
  });
});
