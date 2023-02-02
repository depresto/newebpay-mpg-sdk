import NewebpayClient from "./newebpay.client";

test("buildCheckCode", async () => {
  const client = new NewebpayClient({
    merchantId: "MS12345678",
    hashKey: "AAAvw3YlqoEk6G4HqRKDAYpHKZWxBBB",
    hashIV: "AAAC1FplieBBB",
    env: "sandbox",
  });
  const data = client.buildCheckCode({
    MerchantID: "TWD987086921",
    Amt: 10,
    MerchantOrderNo: "MyCompanyOrder_1638423361",
    TradeNo: "21120214151152468",
  });

  expect(data).toBe(
    "34303E4A134D1F06346AAC43080BBFC7E89F7F46B219C9D2F194EF926ADA8B45"
  );
});

test("getPaymentFormHTML for credit card agreement", async () => {
  const client = new NewebpayClient({
    merchantId: "MS12345678",
    hashKey: "AAAvw3YlqoEk6G4HqRKDAYpHKZWxBBB",
    hashIV: "AAAC1FplieBBB",
    env: "sandbox",
  });
  const data = client.getPaymentFormHTML({
    NotifyURL: "https://webhook.site/cf6018cd-6241-416f-87fa-5b5962482033",
    ReturnURL: "https://webhook.site/cf6018cd-6241-416f-87fa-5b5962482033",
    MerchantOrderNo: Date.now().toString(),
    Amt: 10,
    ItemDesc: "約定信用卡",
    OrderComment: "約定信用卡",
    Email: "wayne@havbeat.com",
    TokenTerm: "UserID",
    CREDITAGREEMENT: 1,
  });

  console.log(data);
});
