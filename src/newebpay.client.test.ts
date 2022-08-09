import NewebpayClient from "./newebpay.client";

test("buildCheckCode", async () => {
  const client = new NewebpayClient({
    merchantId: "ABC1422967",
    hashKey: "abcdefg",
    hashIV: "1234567",
    env: "sandbox",
  });
  const data = client.buildCheckCode({
    MerchantID: "ABC1422967",
    Date: "2015-01-01 00:00:00",
    UseInfo: "ON",
    CreditInst: "ON",
    CreditRed: "ON",
  });

  expect(data).toBe("77A1EF8F23C94CB63A60A7EDF99AC3E0F4688D96AF6D4B34370D306ABD33D0F6");
});
