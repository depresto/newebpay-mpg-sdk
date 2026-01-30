import NewebpayClient from "./newebpay.client";
import { is3DResponse, isSuccessResponse } from ".";
import fs from "fs";

const env = (process.env.TEST_ENV || "sandbox") as "sandbox" | "production";
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
      env,
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
      TokenTerm: "2025011615000000",
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
      MerOrderNo: "2026010812000000",
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
        MerchantOrderNo: "2025011618000000",
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

// 嵌入式信用卡支付頁測試
// 注意：這些測試需要有效的 Prime（從前端 SDK 取得）或 TokenValue
const testPrime = process.env.TEST_PRIME || "";
const testPayerEmail = process.env.TEST_PAYER_EMAIL || "";
const testCardHolderName = process.env.TEST_CARDHOLDER_NAME || "";
const testEmbeddedTokenValue = process.env.TEST_EMBEDDED_TOKEN_VALUE || "";
const testEmbeddedTokenTerm = process.env.TEST_EMBEDDED_TOKEN_TERM || "";

describe("embedded credit card payment API (嵌入式信用卡支付頁)", () => {
  let client: NewebpayClient;

  beforeEach(() => {
    client = new NewebpayClient({
      merchantId,
      hashKey,
      hashIV,
      env,
      options: {
        proxyEndpoint,
        proxySecret,
        userAgent,
      },
    });
  });

  test("should have correct inframeEndpoint for sandbox", () => {
    expect(client.inframeEndpoint).toBe("https://c-inframe.newebpay.com");
  });

  test("should have correct inframeEndpoint for production", () => {
    const prodClient = new NewebpayClient({
      merchantId,
      hashKey,
      hashIV,
      env: "production",
    });
    expect(prodClient.inframeEndpoint).toBe("https://p-inframe.newebpay.com");
  });

  test("should embeddedCreditCardPayment request with valid Prime", async () => {
    // 跳過測試如果沒有設定 TEST_PRIME
    if (!testPrime) {
      console.log("Skipping test: TEST_PRIME not set");
      return;
    }

    try {
      const response = await client.embeddedCreditCardPayment({
        Prime: testPrime,
        MerchantOrderNo: `Order_${Date.now()}`,
        Amt: 1,
        ProdDesc: "嵌入式信用卡測試商品",
        PayerEmail: testPayerEmail,
        CardHolderName: testCardHolderName,
      });

      console.log("P1 Response:", response);

      if (isSuccessResponse(response)) {
        expect(response.Status).toBe("SUCCESS");
        expect(response.Result).toBeDefined();
        if (typeof response.Result === "object") {
          expect(response.Result.MerchantID).toBe(merchantId);
          expect(response.Result.TradeNo).toBeDefined();
        }
      } else if (is3DResponse(response)) {
        console.log("P1 3D Response received");
        const html = typeof response === "string" ? response : response.Result;
        expect(html).toContain("<form");
      } else {
        // 錯誤回應
        expect(typeof response).toBe("object");
        if (typeof response === "object") {
          expect(response.Status).not.toBe("SUCCESS");
        }
      }
    } catch (error) {
      console.log("P1 Error:", error);
    }
  });

  test("should embeddedCreditCardPayment (P1) with TokenSwitch for binding", async () => {
    // 跳過測試如果沒有設定 TEST_PRIME
    if (!testPrime) {
      console.log("Skipping test: TEST_PRIME not set");
      return;
    }

    try {
      const response = await client.embeddedCreditCardPayment({
        Prime: testPrime,
        MerchantOrderNo: `Order_${Date.now()}`,
        Amt: 100,
        ProdDesc: "嵌入式信用卡綁卡測試",
        PayerEmail: "test@example.com",
        CardHolderName: "Test User",
        TokenSwitch: "get",
        TokenTerm: "test@example.com",
      });

      console.log("P1 Binding Response:", response);

      if (isSuccessResponse(response)) {
        expect(response.Status).toBe("SUCCESS");
        if (typeof response.Result === "object") {
          expect(response.Result.MerchantID).toBe(merchantId);
          // 綁卡成功應該回傳 TokenValue
          if (response.Result.TokenValue) {
            console.log("TokenValue for Pn:", response.Result.TokenValue);
            expect(response.Result.TokenLife).toBeDefined();
          }
        }
      } else if (is3DResponse(response)) {
        console.log("P1 3D Response received during binding");
      } else {
        if (typeof response === "object") {
          expect(response.Status).not.toBe("SUCCESS");
        }
      }
    } catch (error) {
      console.log("P1 Binding Error:", error);
    }
  });

  test("should embeddedTokenPayment request with valid TokenValue", async () => {
    // 跳過測試如果沒有設定相關環境變數
    if (!testEmbeddedTokenValue || !testEmbeddedTokenTerm) {
      console.log(
        "Skipping test: TEST_EMBEDDED_TOKEN_VALUE or TEST_EMBEDDED_TOKEN_TERM not set"
      );
      return;
    }

    try {
      const response = await client.embeddedTokenPayment({
        TokenValue: testEmbeddedTokenValue,
        TokenTerm: testEmbeddedTokenTerm,
        MerchantOrderNo: `Order_${Date.now()}`,
        Amt: 100,
        ProdDesc: "嵌入式後續約定付款測試",
      });

      console.log("Pn Response:", response);

      if (isSuccessResponse(response)) {
        expect(response.Status).toBe("SUCCESS");
        if (typeof response.Result === "object") {
          expect(response.Result.MerchantID).toBe(merchantId);
          expect(response.Result.TradeNo).toBeDefined();
          expect(response.Result.TokenLife).toBeDefined();
        }
      } else if (is3DResponse(response)) {
        console.log("Pn 3D Response received");
      } else {
        if (typeof response === "object") {
          expect(response.Status).not.toBe("SUCCESS");
        }
      }
    } catch (error) {
      console.log("Pn Error:", error);
    }
  });

  test("should embeddedTokenPayment (Pn) with installment", async () => {
    // 跳過測試如果沒有設定相關環境變數
    if (!testEmbeddedTokenValue || !testEmbeddedTokenTerm) {
      console.log(
        "Skipping test: TEST_EMBEDDED_TOKEN_VALUE or TEST_EMBEDDED_TOKEN_TERM not set"
      );
      return;
    }

    try {
      const response = await client.embeddedTokenPayment({
        TokenValue: testEmbeddedTokenValue,
        TokenTerm: testEmbeddedTokenTerm,
        MerchantOrderNo: `Order_${Date.now()}`,
        Amt: 1000,
        ProdDesc: "嵌入式後續約定付款分期測試",
        Inst: "3", // 分 3 期
      });

      console.log("Pn Installment Response:", response);
      if (typeof response !== "string") {
        expect(response.Status).toBeDefined();
      }
    } catch (error) {
      console.log("Pn Installment Error:", error);
    }
  });

  test("should handle embeddedCreditCardPayment error with invalid Prime", async () => {
    try {
      const response = await client.embeddedCreditCardPayment({
        Prime: "invalid_prime_value",
        MerchantOrderNo: `Order_${Date.now()}`,
        Amt: 100,
        ProdDesc: "測試無效 Prime",
        PayerEmail: "test@example.com",
        CardHolderName: "Test User",
      });

      console.log("Invalid Prime Response:", response);
      // 預期會回傳錯誤狀態
      if (typeof response === "object") {
        expect(response.Status).not.toBe("SUCCESS");
      } else {
        // 如果是 string，通常是 3D，但在無效 Prime 情況下不太可能
        console.log("Unexpected string response for invalid Prime");
      }
    } catch (error) {
      // API 可能會拋出錯誤
      console.log("Expected error with invalid Prime:", error);
      expect(error).toBeDefined();
    }
  });

  test("should handle embeddedTokenPayment error with invalid TokenValue", async () => {
    try {
      const response = await client.embeddedTokenPayment({
        TokenValue: "invalid_token_value",
        TokenTerm: "invalid_token_term",
        MerchantOrderNo: `Order_${Date.now()}`,
        Amt: 100,
        ProdDesc: "測試無效 TokenValue",
      });

      console.log("Invalid TokenValue Response:", response);
      // 預期會回傳錯誤狀態
      if (typeof response === "object") {
        expect(response.Status).not.toBe("SUCCESS");
      }
    } catch (error) {
      // API 可能會拋出錯誤
      console.log("Expected error with invalid TokenValue:", error);
      expect(error).toBeDefined();
    }
  });

  test("should embeddedCreditCardPayment (P1) with P3D=1 for 3D verification", async () => {
    // 跳過測試如果沒有設定 TEST_PRIME
    if (!testPrime) {
      console.log("Skipping test: TEST_PRIME not set");
      return;
    }

    try {
      const response = await client.embeddedCreditCardPayment({
        Prime: testPrime,
        MerchantOrderNo: `Order_${Date.now()}`,
        Amt: 100,
        ProdDesc: "3D 驗證測試商品",
        PayerEmail: "test@example.com",
        CardHolderName: "Test User",
        P3D: "1",
        NotifyURL: notifyUrl,
        ReturnURL: returnUrl,
      });

      if (typeof response !== "string") {
        expect(response.Status).toBeDefined();
        expect(response.Message).toBeDefined();
      }
      console.log("P1 3D Response:", response);

      // 檢查是否為 3D 回應
      if (is3DResponse(response)) {
        console.log("3D HTML received");
        const decodedHtml = client.decode3DHTML(response.Result);
        console.log("Decoded 3D HTML (first 200 chars):", decodedHtml.substring(0, 200));
        // 驗證解碼後的 HTML 包含 form 元素
        expect(decodedHtml).toContain("<form");
        expect(decodedHtml).toContain("</form>");
      } else if (isSuccessResponse(response)) {
        // 若不需要 3D 驗證，則直接成功
        console.log("Non-3D success response:", response.Result);
        expect(response.Result.TradeNo).toBeDefined();
      }
    } catch (error) {
      console.log("P1 3D Error:", error);
    }
  });

  test("should decode3DHTML correctly", () => {
    // 測試 URL encoded HTML 解碼
    const encodedHtml = "%3Cform+name%3D%27spgateway%27+action%3D%27https%3A%2F%2Fccore.newebpay.com%2FAPI%2FCreditCard%2FthreeDreturn%27+method%3D%27POST%27%3E%3Cinput+type%3D%27hidden%27+name%3D%27end_out%27+value%3D%27test%27%3E%3C%2Fform%3E";
    const decodedHtml = client.decode3DHTML(encodedHtml);

    console.log("Decoded HTML:", decodedHtml);

    expect(decodedHtml).toContain("<form name='spgateway'");
    expect(decodedHtml).toContain("action='https://ccore.newebpay.com/API/CreditCard/threeDreturn'");
    expect(decodedHtml).toContain("method='POST'");
    expect(decodedHtml).toContain("<input type='hidden' name='end_out' value='test'>");
    expect(decodedHtml).toContain("</form>");
  });

  test("should is3DResponse type guard work correctly", () => {
    // 測試 3D 回應
    const response3D = {
      Status: "SUCCESS" as const,
      Message: "成功取得 3D HTML",
      Result: "%3Cform+name%3D%27spgateway%27%3E%3C%2Fform%3E",
    };
    expect(is3DResponse(response3D)).toBe(true);
    expect(client.is3DResponse(response3D)).toBe(true);

    // 測試非 3D 回應
    const responseNormal = {
      Status: "SUCCESS" as const,
      Message: "授權成功",
      Result: {
        MerchantID: "MS123456",
        Amt: 100,
        TradeNo: "24071714322191423",
        MerchantOrderNo: "Order_123",
        RespondCode: "00",
        AuthBank: "Esun",
        AuthDate: "20240717",
        AuthTime: "143221",
        Card6No: "123456",
        Card4No: "7890",
        Exp: "2512",
        PaymentMethod: "CREDIT" as const,
        IP: "192.168.1.1",
        CheckCode: "ABC123",
      },
    };
    expect(is3DResponse(responseNormal)).toBe(false);
    expect(isSuccessResponse(responseNormal)).toBe(true);

    // 測試錯誤回應
    const responseError = {
      Status: "LIB10002",
      Message: "Prime 驗證失敗",
      Result: "",
    };
    expect(is3DResponse(responseError)).toBe(false);
    expect(isSuccessResponse(responseError)).toBe(false);
  });
});
