import NewebpayClient from "./newebpay.client";
import fs from "fs";

const merchantId = process.env.TEST_MERCHANT_ID || "";
const hashKey = process.env.TEST_HASH_KEY || "";
const hashIV = process.env.TEST_HASH_IV || "";

const proxyEndpoint = process.env.TEST_PROXY_ENDPOINT;
const proxySecret = process.env.TEST_PROXY_SECRET;
const userAgent = process.env.TEST_PROXY_USER_AGENT;

const returnUrl = process.env.TEST_RETURN_URL || "";
const notifyUrl = process.env.TEST_NOTIFY_URL || "";
const clientBackUrl = process.env.TEST_CLIENT_BACK_URL || "";

const tradeInfo = process.env.TEST_TRADE_INFO || "";

const testCardToken = process.env.TEST_CARD_TOKEN || "";

describe("MPG API", () => {
  let client: NewebpayClient;

  beforeEach(() => {
    client = new NewebpayClient({
      merchantId,
      hashKey,
      hashIV,
      env: "sandbox",
      options: {
        proxyEndpoint,
        proxySecret,
        userAgent,
      },
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

  test("should getPaymentFormHTML for token agreement (綁卡)", async () => {
    const data = client.getPaymentFormHTML({
      Version: "2.0",
      NotifyURL: notifyUrl,
      ReturnURL: returnUrl,
      MerchantOrderNo: "2025011614000000",
      Amt: 100,
      ItemDesc: "約定付款綁卡測試",
      OrderComment: "約定付款綁卡",
      Email: "wayne@havppen.com",
      CREDIT: 1,
      CREDITAGREEMENT: 1,
      TokenTerm: "2026-01-16",
    });

    console.log(data);
    expect(data).toBeDefined();
    // 驗證 HTML 包含 Version 2.4
    expect(data).toContain('name="Version" value="2.0"');
    // 驗證包含表單元素
    expect(data).toContain("<form");
    expect(data).toContain('name="MerchantID"');
    expect(data).toContain('name="TradeInfo"');
    expect(data).toContain('name="TradeSha"');
    // 驗證表單 action 指向正確的 endpoint
    expect(data).toContain("/MPG/mpg_gateway");
  });

  test("should getPaymentFormHTML with version 2.0 when agreement params present", async () => {
    const data = client.getPaymentFormHTML({
      NotifyURL: notifyUrl,
      ReturnURL: returnUrl,
      MerchantOrderNo: "2025011615000000",
      Amt: 100,
      ItemDesc: "約定付款綁卡測試（自動版本）",
      Email: "wayne@havppen.com",
      CREDIT: 1,
      CREDITAGREEMENT: 1,
    });

    console.log(data);
    expect(data).toBeDefined();
    expect(data).toContain('name="Version" value="2.0"');
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

describe("MPG API", () => {
  let client: NewebpayClient;

  beforeEach(() => {
    client = new NewebpayClient({
      merchantId,
      hashKey,
      hashIV,
      env: "sandbox",
      options: {
        proxyEndpoint,
        proxySecret,
        userAgent,
      },
    });
  });

  test("should parseTradeInfo success", async () => {
    // 如果沒有設定 TEST_TRADE_INFO，則跳過測試
    if (!tradeInfo) {
      return;
    }

    const data = client.parseTradeInfo(tradeInfo);
    console.log(data);
    expect(data).toBeDefined();
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
      options: {
        proxyEndpoint,
        proxySecret,
        userAgent,
      },
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
      options: {
        proxyEndpoint,
        proxySecret,
        userAgent,
      },
    });
  });

  test("should alterPeriodicPaymentStatus request success", async () => {
    try {
      const response = await client.alterPeriodicPaymentStatus({
        MerOrderNo: "17375268628812470",
        PeriodNo: "P250122142116GWoCQJ",
        AlterType: "terminate",
      });
      console.log(response);
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

describe("token payment API", () => {
  let client: NewebpayClient;

  beforeEach(() => {
    client = new NewebpayClient({
      merchantId,
      hashKey,
      hashIV,
      env: "sandbox",
      options: {
        proxyEndpoint,
        proxySecret,
        userAgent,
      },
    });
  });

  test("should authorizeTokenPayment request success", async () => {
    try {
      const response = await client.authorizeTokenPayment({
        MerchantOrderNo: "2025011613000000",
        Amt: 10,
        TokenValue: testCardToken,
        ProdDesc: "測試商品",
        PayerEmail: "wayne@havppen.com",
        TokenTerm: "2026-01-16",
        TokenSwitch: "on",
        CardHolderName: "Test User",
      });
      console.log(response);
      expect(response.Status).toBeDefined();
      expect(response.Message).toBeDefined();
      expect(response.Result).toBeDefined();
    } catch (error) {
      console.log(error);
    }
  });

  test("should queryTokenStatus request success", async () => {
    try {
      const response = await client.queryTokenStatus({
        TokenTerm: "2026-01-16",
        TokenValue: testCardToken,
      });
      console.log(response);
      expect(response.Status).toBeDefined();
      expect(response.Message).toBeDefined();
      expect(response.Result).toBeDefined();
      if (response.Result) {
        expect(response.Result.MerchantID).toBeDefined();
        expect(response.Result.MerchantOrderNo).toBeDefined();
      }
    } catch (error) {
      console.log(error);
    }
  });

  test("should unbindToken request success", async () => {
    try {
      const response = await client.unbindToken({
        TokenTerm: "2026-01-16",
        TokenValue: testCardToken,
      });
      console.log(response);
      expect(response.Status).toBeDefined();
      expect(response.Message).toBeDefined();
      expect(response.Result).toBeDefined();
      if (response.Result) {
        expect(response.Result.MerchantID).toBeDefined();
        expect(response.Result.MerchantOrderNo).toBeDefined();
      }
    } catch (error) {
      console.log(error);
    }
  });
});
