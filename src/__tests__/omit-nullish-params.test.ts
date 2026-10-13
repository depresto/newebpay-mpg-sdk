import FormData from "form-data";
import NewebpayClient from "../newebpay.client";

// 固定測試金鑰（32 bytes key / 16 bytes iv），不連外網
const HASH_KEY = "12345678901234567890123456789012";
const HASH_IV = "1234567890123456";

const createClient = () =>
  new NewebpayClient({
    merchantId: "MS_TEST",
    partnerId: "PARTNER_TEST",
    hashKey: HASH_KEY,
    hashIV: HASH_IV,
    env: "sandbox",
  });

type Capture = (client: NewebpayClient, params: any) => Promise<string>;

/** 攔截 apiInstance.post 送出的 FormData，取出指定欄位後解密 */
const captureFormField =
  (field: string, call: (client: NewebpayClient, params: any) => Promise<any>): Capture =>
  async (client, params) => {
    const appended: Record<string, string> = {};
    const spy = jest
      .spyOn(FormData.prototype, "append")
      .mockImplementation(function (this: FormData, key: string, value: any) {
        appended[key] = value;
      } as any);
    jest
      .spyOn(client.apiInstance, "post")
      .mockResolvedValue({
        data: {
          Status: "SUCCESS",
          status: "SUCCESS",
          period: client.encryptAESString("{}"),
        },
      });
    try {
      await call(client, params);
    } finally {
      spy.mockRestore();
    }
    return client.decryptAESString(appended[field]);
  };

/** 攔截 apiInstance.post 送出的 plain object body，取出指定欄位後解密 */
const captureBodyField =
  (field: string, call: (client: NewebpayClient, params: any) => Promise<any>): Capture =>
  async (client, params) => {
    const post = jest
      .spyOn(client.apiInstance, "post")
      .mockResolvedValue({ data: { Status: "SUCCESS" } });
    await call(client, params);
    return client.decryptAESString((post.mock.calls[0][1] as any)[field]);
  };

/** 從 HTML form 取出 hidden input 值後解密 */
const captureHtmlField =
  (field: string, call: (client: NewebpayClient, params: any) => string): Capture =>
  async (client, params) => {
    const html = call(client, params);
    const match = html.match(new RegExp(`name="${field}" value="([0-9a-f]+)"`));
    return client.decryptAESString(match![1]);
  };

type Case = {
  name: string;
  capture: Capture;
  base: Record<string, any>;
  /** 可選欄位（呼叫端可能傳 undefined/null 的鍵） */
  optionalKey: string;
  /** 有值案例使用的合法值（預設 "VALUE"） */
  value?: string;
};

const cases: Case[] = [
  {
    name: "getPaymentFormHTML",
    capture: captureHtmlField("TradeInfo", (c, p) => c.getPaymentFormHTML(p)),
    base: { MerchantOrderNo: "O1", Amt: 100, ItemDesc: "商品" },
    optionalKey: "TokenTerm",
  },
  {
    name: "createPeriodicPaymentHTML",
    capture: captureHtmlField("PostData_", (c, p) => c.createPeriodicPaymentHTML(p)),
    base: { MerchantOrderNo: "O1", PeriodAmt: 100, PeriodTimes: 3 },
    optionalKey: "PeriodFirstdate",
    value: "2026/01/01",
  },
  {
    name: "requestCreditCardPayment",
    capture: captureFormField("PostData_", (c, p) => c.requestCreditCardPayment(p)),
    base: { MerchantOrderNo: "O1", Amt: 100, TokenSwitch: "on" },
    optionalKey: "TokenTerm",
  },
  {
    name: "authorizeTokenPayment",
    capture: captureBodyField("PostData_", (c, p) => c.authorizeTokenPayment(p)),
    base: { MerchantOrderNo: "O1", Amt: 100 },
    optionalKey: "TokenTerm",
  },
  {
    name: "refundCreditCard",
    capture: captureFormField("PostData_", (c, p) => c.refundCreditCard(p)),
    base: { MerchantOrderNo: "O1", Amt: 100 },
    optionalKey: "TradeNo",
  },
  {
    name: "cancelCreditCard",
    capture: captureFormField("PostData_", (c, p) => c.cancelCreditCard(p)),
    base: { MerchantOrderNo: "O1", Amt: 100 },
    optionalKey: "TradeNo",
  },
  {
    name: "alterPeriodicPaymentStatus",
    capture: captureFormField("PostData_", (c, p) => c.alterPeriodicPaymentStatus(p)),
    base: { MerOrderNo: "O1", PeriodNo: "P1" },
    optionalKey: "AlterType",
  },
  {
    name: "alterPeriodicPaymentAmount",
    capture: captureFormField("PostData_", (c, p) => c.alterPeriodicPaymentAmount(p)),
    base: { MerOrderNo: "O1", PeriodNo: "P1" },
    optionalKey: "AlterAmt",
  },
  {
    name: "addMerchant",
    capture: captureFormField("PostData_", (c, p) => c.addMerchant(p)),
    base: { MemberUnifiedNo: "12345678" },
    optionalKey: "MemberName",
  },
  {
    name: "modifyMerchant",
    capture: captureFormField("PostData_", (c, p) => c.modifyMerchant(p)),
    base: { MemberUnifiedNo: "12345678" },
    optionalKey: "MemberName",
  },
  {
    name: "chargeMerchant",
    capture: captureFormField("PostData_", (c, p) => c.chargeMerchant(p)),
    base: { MemberUnifiedNo: "12345678" },
    optionalKey: "MemberName",
  },
  {
    name: "queryTokenStatus",
    capture: captureBodyField("EncryptData_", (c, p) => c.queryTokenStatus(p)),
    base: { TokenValue: "TV1" },
    optionalKey: "TokenTerm",
  },
  {
    name: "unbindToken",
    capture: captureBodyField("EncryptData_", (c, p) => c.unbindToken(p)),
    base: { TokenValue: "TV1" },
    optionalKey: "TokenTerm",
  },
];

describe("SDK 序列化時移除 undefined/null 欄位", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe.each(cases)("$name", ({ capture, base, optionalKey, value = "VALUE" }) => {
    it("[UT-1] 可選欄位為 undefined 時，解密後 TradeInfo 不含該鍵也不含 =undefined", async () => {
      const decrypted = await capture(createClient(), {
        ...base,
        [optionalKey]: undefined,
      });
      expect(new URLSearchParams(decrypted).has(optionalKey)).toBe(false);
      expect(decrypted).not.toContain("=undefined");
    });

    it("[UT-2] 可選欄位為 null 時，解密後 TradeInfo 不含該鍵也不含 =null", async () => {
      const decrypted = await capture(createClient(), {
        ...base,
        [optionalKey]: null,
      });
      expect(new URLSearchParams(decrypted).has(optionalKey)).toBe(false);
      expect(decrypted).not.toContain("=null");
    });

    it("[UT-3] 可選欄位有值時仍被序列化", async () => {
      const decrypted = await capture(createClient(), {
        ...base,
        [optionalKey]: value,
      });
      expect(new URLSearchParams(decrypted).get(optionalKey)).toBe(value);
    });
  });

  describe("buildTradeInfo", () => {
    it("[UT-4] 空字串、0、false 必須保留", () => {
      const client = createClient();
      const decrypted = client.decryptAESString(
        client.buildTradeInfo({
          InstFlag: "",
          CREDIT: 0,
          Flag: false,
          Gone: undefined,
          Nothing: null,
        })
      );
      expect(decrypted).toBe("InstFlag=&CREDIT=0&Flag=false");
    });

    it("[UT-5] 有值欄位的序列化結果與順序和修改前逐字相同", () => {
      const client = createClient();
      const decrypted = client.decryptAESString(
        client.buildTradeInfo({
          MerchantID: "MS_TEST",
          RespondType: "JSON",
          TimeStamp: "1700000000",
          Version: "2.0",
          Amt: 100,
          ItemDesc: "測試 商品&特殊=字元",
          Email: "a@b.com",
        })
      );
      expect(decrypted).toBe(
        new URLSearchParams({
          MerchantID: "MS_TEST",
          RespondType: "JSON",
          TimeStamp: "1700000000",
          Version: "2.0",
          Amt: "100",
          ItemDesc: "測試 商品&特殊=字元",
          Email: "a@b.com",
        }).toString()
      );
      expect(decrypted).toBe(
        "MerchantID=MS_TEST&RespondType=JSON&TimeStamp=1700000000&Version=2.0&Amt=100&ItemDesc=%E6%B8%AC%E8%A9%A6+%E5%95%86%E5%93%81%26%E7%89%B9%E6%AE%8A%3D%E5%AD%97%E5%85%83&Email=a%40b.com"
      );
    });
  });

  describe("簽章序列化點", () => {
    it("[UT-6] buildCheckValue 忽略 undefined/null 鍵，等同未傳該鍵", () => {
      const client = createClient();
      const clean = client.buildCheckValue({ Amt: 1, MerchantID: "M" });
      expect(
        client.buildCheckValue({ Amt: 1, MerchantID: "M", X: undefined, Y: null })
      ).toBe(clean);
    });

    it("[UT-7] buildCheckCode 忽略 undefined/null 鍵，等同未傳該鍵", () => {
      const client = createClient();
      const clean = client.buildCheckCode({ Amt: 1, MerchantID: "M" });
      expect(
        client.buildCheckCode({ Amt: 1, MerchantID: "M", X: undefined, Y: null })
      ).toBe(clean);
    });
  });

  describe("refundEWallet", () => {
    it("[UT-8] JSON 內的 null 不送出，空字串/0/false 保留", async () => {
      const client = createClient();
      const appended: Record<string, string> = {};
      const spy = jest
        .spyOn(FormData.prototype, "append")
        .mockImplementation(function (this: FormData, key: string, value: any) {
          appended[key] = value;
        } as any);
      jest
        .spyOn(client.apiInstance, "post")
        .mockResolvedValue({ data: { Status: "SUCCESS" } });
      await client.refundEWallet({
        MerchantOrderNo: "O1",
        Amt: 0,
        Memo: "",
        Gone: null,
      } as any);
      spy.mockRestore();
      const json = JSON.parse(client.decryptAESString(appended["EncryptData_"]));
      expect(json).not.toHaveProperty("Gone");
      expect(json.Amt).toBe(0);
      expect(json.Memo).toBe("");
    });
  });

  describe("embedded 路徑 body", () => {
    it("[UT-9] embeddedCreditCardPayment 的 null/undefined 不出現在 body，空字串/0/false 保留", async () => {
      const client = createClient();
      const post = jest
        .spyOn(client.inframeInstance, "post")
        .mockResolvedValue({ data: { Status: "SUCCESS" } });
      await client.embeddedCreditCardPayment({
        Prime: "PRIME",
        MerchantOrderNo: "O1",
        Amt: 0,
        InstFlag: "",
        P3D: false,
        TokenTerm: undefined,
        PayerEmail: null,
      } as any);
      const body = post.mock.calls[0][1] as Record<string, unknown>;
      expect(body).not.toHaveProperty("TokenTerm");
      expect(body).not.toHaveProperty("PayerEmail");
      expect(body).toMatchObject({ Amt: 0, InstFlag: "", P3D: false });
      expect(body).not.toHaveProperty("Prime");
    });

    it("[UT-10] embeddedTokenPayment 的 null/undefined 不出現在 body，空字串/0/false 保留", async () => {
      const client = createClient();
      const post = jest
        .spyOn(client.inframeInstance, "post")
        .mockResolvedValue({ data: { Status: "SUCCESS" } });
      await client.embeddedTokenPayment({
        TokenValue: "TV",
        MerchantOrderNo: "O1",
        Amt: 0,
        InstFlag: "",
        P3D: false,
        TokenTerm: undefined,
        PayerEmail: null,
      } as any);
      const body = post.mock.calls[0][1] as Record<string, unknown>;
      expect(body).not.toHaveProperty("TokenTerm");
      expect(body).not.toHaveProperty("PayerEmail");
      expect(body).toMatchObject({
        Amt: 0,
        InstFlag: "",
        P3D: false,
        TokenSwitch: "on",
      });
    });
  });
});
