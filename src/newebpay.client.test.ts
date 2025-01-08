import NewebpayClient from "./newebpay.client";
import fs from "fs";

const merchantId = process.env.TEST_MERCHANT_ID || "";
const hashKey = process.env.TEST_HASH_KEY || "";
const hashIV = process.env.TEST_HASH_IV || "";
const returnUrl = process.env.TEST_RETURN_URL || "";
const notifyUrl = process.env.TEST_NOTIFY_URL || "";
const clientBackUrl = process.env.TEST_CLIENT_BACK_URL || "";

test("buildCheckCode", async () => {
  const client = new NewebpayClient({
    merchantId,
    hashKey,
    hashIV,
    env: "sandbox",
  });
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

test("getPaymentFormHTML for credit card agreement", async () => {
  const client = new NewebpayClient({
    merchantId,
    hashKey,
    hashIV,
    env: "sandbox",
  });
  const data = client.getPaymentFormHTML({
    NotifyURL: "https://webhook.site/dcf03f1f-e2de-42d8-b39f-c5387a325508",
    ReturnURL: "https://webhook.site/dcf03f1f-e2de-42d8-b39f-c5387a325508",
    MerchantOrderNo: Date.now().toString(),
    Amt: 10,
    ItemDesc: "約定信用卡",
    OrderComment: "約定信用卡",
    Email: "wayne@havppen.com",
    TokenTerm: "UserID",
    CREDITAGREEMENT: 1,
  });

  console.log(data);
});

test("createPeriodicPaymentHTML", async () => {
  const client = new NewebpayClient({
    merchantId,
    hashKey,
    hashIV,
    env: "sandbox",
  });
  const data = client.createPeriodicPaymentHTML({
    LangType: "zh-Tw",
    MerOrderNo: "2020072812000000",
    ProdDesc: "約定信用卡",
    PeriodAmt: 10,
    PeriodType: "M",
    PeriodPoint: "01",
    PeriodStartType: 1,
    PeriodTimes: 99,
    PeriodFirstdate: "2020/07/28",
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
});

test("parsePeriodicPaymentResponse", async () => {
  const client = new NewebpayClient({
    merchantId,
    hashKey,
    hashIV,
    env: "sandbox",
  });

  const rawResponse = fs.readFileSync(
    "./test/periodicPaymentResponse.txt",
    "utf8"
  );
  const response = client.parsePeriodicPaymentResponse(rawResponse);

  console.log(response);
});
