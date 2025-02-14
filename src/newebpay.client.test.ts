import NewebpayClient from "./newebpay.client";
import fs from "fs";

const merchantId = process.env.TEST_MERCHANT_ID || "";
const hashKey = process.env.TEST_HASH_KEY || "";
const hashIV = process.env.TEST_HASH_IV || "";
const returnUrl = process.env.TEST_RETURN_URL || "";
const notifyUrl = process.env.TEST_NOTIFY_URL || "";
const clientBackUrl = process.env.TEST_CLIENT_BACK_URL || "";

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

  test("should getPaymentFormHTML for credit card agreement", async () => {
    const data = client.getPaymentFormHTML({
      NotifyURL: notifyUrl,
      ReturnURL: returnUrl,
      MerchantOrderNo: "2025011611000000",
      Amt: 10,
      ItemDesc: "測試",
      OrderComment: "測試",
      Email: "wayne@havppen.com",
      CREDIT: 1,
      CVS: 1,
      WEBATM: 1,
    });

    console.log(data);
    expect(data).toBeDefined();
  });

  test("should buildCheckCode success", async () => {
    const data = client.buildCheckCode({
      MerchantID: "TWD987086921",
      Amt: 10,
      MerchantOrderNo: "MyCompanyOrder_1638423361",
      TradeNo: "21120214151152468",
    });

    expect(data).toBe(
      "7C5091FB35A16FD222C197C4B711FE2A8848D9BFD01A098A62EC9C4C45C78CAF"
    );
  });
});

describe("periodic payment API", () => {
  let client: NewebpayClient;

  beforeEach(() => {
    client = new NewebpayClient({
      merchantId,
      hashKey,
      hashIV,
      env: "sandbox",
    });
  });

  test("should createPeriodicPaymentHTML with html", async () => {
    const client = new NewebpayClient({
      merchantId,
      hashKey,
      hashIV,
      env: "sandbox",
    });
    const data = client.createPeriodicPaymentHTML({
      LangType: "zh-Tw",
      MerOrderNo: "2025011612000000",
      ProdDesc: "約定信用卡",
      PeriodAmt: 10,
      PeriodType: "M",
      PeriodPoint: "01",
      PeriodStartType: 1,
      PeriodTimes: 99,
      PeriodMemo: "約定信用卡",
      PayerEmail: "wayne@havppen.com",
      EmailModify: 0,
      PaymentInfo: "N",
      OrderInfo: "N",
      ReturnURL: returnUrl,
      NotifyURL: notifyUrl,
      BackURL: clientBackUrl,
      UNIONPAY: 0,
    });

    console.log(data);
    expect(data).toBeDefined();
  });

  test("should parseCreatePeriodicPaymentResponse", async () => {
    // TODO: create this file when you get the response from the API
    const rawResponse = fs.readFileSync(
      "./test/periodicPaymentCreationResponse.txt",
      "utf8"
    );
    const response = client.parseCreatePeriodicPaymentResponse(rawResponse);

    console.log(response);
    expect(response.Status).toBeDefined();
    expect(response.Message).toBeDefined();
    expect(response.Result).toBeDefined();
    expect(response.Result.DateArray).toBeDefined();
  });

  test("should periodicPaymentCreationFailResponse", async () => {
    const rawResponse = fs.readFileSync(
      "./test/periodicPaymentCreationFailResponse.txt",
      "utf8"
    );
    const response = client.parseCreatePeriodicPaymentResponse(rawResponse);

    console.log(response);
  });

  test("should parsePeriodicPaymentResponse", async () => {
    // TODO: create this file when you get the response from the API
    const rawResponse = fs.readFileSync(
      "./test/periodicPaymentResponse.txt",
      "utf8"
    );

    const response = client.parsePeriodicPaymentResponse(rawResponse);

    expect(response.Status).toBeDefined();
    expect(response.Message).toBeDefined();
    expect(response.Result).toBeDefined();
    expect(response.Result.AuthBank).toBeDefined();
  });
});

describe("periodic payment alter API", () => {
  let client: NewebpayClient;

  beforeEach(() => {
    client = new NewebpayClient({
      merchantId,
      hashKey,
      hashIV,
      env: "sandbox",
    });
  });

  test("should alterPeriodicPaymentStatus request success", async () => {
    try {
      const response = await client.alterPeriodicPaymentStatus({
        MerOrderNo: "17375268628812470",
        PeriodNo: "P250122142116GWoCQJ",
        AlterType: "terminate",
      });
      console.log(response)
      expect(response.Status).toBeDefined();
      expect(response.Result?.MerOrderNo).toBeDefined();
    } catch (error) {
      console.log(error);
    }
  });

  test("should alterPeriodicPaymentAmount request success", async () => {
    const response = await client.alterPeriodicPaymentAmount({
      MerOrderNo: "2025010812000000",
      PeriodNo: "P250108170419c04GYx",
      AlterAmt: 20,
    });

    expect(response.Status).toBeDefined();
    expect(response.Result?.MerOrderNo).toBeDefined();
  });
});
