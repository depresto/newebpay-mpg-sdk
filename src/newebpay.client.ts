import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import crypto from "crypto";
import FormData from "form-data";
import {
  AddMerchantParams,
  AlterPeriodicPaymentAmountParams,
  AlterPeriodicPaymentAmountResponse,
  AlterPeriodicPaymentStatusParams,
  AlterPeriodicPaymentStatusResponse,
  CancelCreditCardParams,
  ChargeMerchantResult,
  CreatePeriodicPaymentHTMLParams,
  CreatePeriodicPaymentResponse,
  CreditCardPaymentParams,
  EmbeddedPaymentParams,
  EmbeddedPaymentResponse,
  EmbeddedTokenPaymentParams,
  GetPaymentFormHTMLParams,
  is3DResponse,
  ModifyMerchantParams,
  PeriodicPaymentResponse,
  QueryTokenStatusParams,
  QueryTokenStatusResponse,
  QueryTradeInfoParams,
  RefundCreditCardParams,
  RefundEWalletParams,
  TokenPaymentParams,
  TokenPaymentResponse,
  TradeInfo,
  UnbindTokenParams,
  UnbindTokenResponse,
} from ".";

type NewebpayClientOptions = {
  proxyEndpoint?: string;
  proxySecret?: string;
  userAgent?: string;
};

export class NewebpayClient {
  partnerId: string | null;
  merchantId: string;
  hashKey: string;
  hashIV: string;
  apiEndpoint: string;
  inframeEndpoint: string;
  env: "sandbox" | "production";
  proxyEndpoint?: string;
  proxySecret?: string;
  userAgent?: string;

  apiInstance: AxiosInstance;
  inframeInstance: AxiosInstance;

  constructor(params: {
    partnerId?: string;
    merchantId: string;
    hashKey: string;
    hashIV: string;
    env: "sandbox" | "production";
    options?: NewebpayClientOptions;
  }) {
    const isDryRun = params.env === "sandbox";

    this.env = params.env;
    this.partnerId = params.partnerId ?? null;
    this.merchantId = params.merchantId;
    this.hashKey = params.hashKey;
    this.hashIV = params.hashIV;

    this.userAgent = params.options?.userAgent;
    this.proxyEndpoint = params.options?.proxyEndpoint;
    this.proxySecret = params.options?.proxySecret;
    this.apiEndpoint = isDryRun
      ? "https://ccore.newebpay.com"
      : "https://core.newebpay.com";
    this.inframeEndpoint = isDryRun
      ? "https://c-inframe.newebpay.com"
      : "https://p-inframe.newebpay.com";

    this.apiInstance = this.createApiInstance({
      apiEndpoint: this.apiEndpoint,
      proxyEndpoint: this.proxyEndpoint,
      proxySecret: this.proxySecret,
      userAgent: this.userAgent,
      defaultHeaders: {
        "Content-Type": "multipart/form-data",
      },
    });
    this.inframeInstance = this.createApiInstance({
      apiEndpoint: this.inframeEndpoint,
      proxyEndpoint: this.proxyEndpoint,
      proxySecret: this.proxySecret,
      userAgent: this.userAgent,
    });
  }

  /**
   * Parse TradeInfo string from API
   *
   * @param tradeInfo - API TradeInfo string
   */
  public parseTradeInfo(tradeInfo: string) {
    const decrypted = this.decryptAESString(tradeInfo);

    return JSON.parse(decrypted) as TradeInfo;
  }

  public decryptAESString(encrypted: string) {
    const decipher = crypto.createDecipheriv(
      "aes256",
      this.hashKey,
      this.hashIV
    );
    decipher.setAutoPadding(false);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted.replace(/[\x00-\x20]+/g, "");
  }

  /**
   * Generate Newebpay payment HTML form
   */
  public getPaymentFormHTML(params: GetPaymentFormHTMLParams): string {
    const Version = params.Version ?? "2.0";
    const TimeStamp = this.getTimeStamp();
    const tradeInfo = this.buildTradeInfo({
      MerchantID: this.merchantId,
      RespondType: "JSON",
      TimeStamp,
      Version,
      LangType: "zh-tw",
      LoginType: 0,
      ...params,
    });
    const tradeSha = this.buildTradeSha(tradeInfo);

    const html: string[] = [];
    const paymentEndpoint = `${this.apiEndpoint}/MPG/mpg_gateway`;
    const formId = `_auto_pay_Form_${new Date().getTime()}`;

    html.push(
      `<form id="${formId}" method="post" action="${paymentEndpoint}">`
    );
    html.push(
      `<input type="hidden" name="MerchantID" value="${this.merchantId}" />`
    );
    html.push(`<input type="hidden" name="Version" value="${Version}" />`);
    html.push(`<input type="hidden" name="TradeInfo" value="${tradeInfo}" />`);
    html.push(`<input type="hidden" name="TradeSha" value="${tradeSha}" />`);

    html.push("</form>");
    html.push("<script>");
    html.push(`document.getElementById("${formId}").submit();`);
    html.push("</script>");
    return html.join("\n");
  }

  public async queryTradeInfo(params: QueryTradeInfoParams) {
    const { Amt, MerchantOrderNo } = params;
    const MerchantID = this.merchantId;
    const Version = "1.3";
    const TimeStamp = this.getTimeStamp();
    const CheckValue = this.buildCheckValue({
      Amt,
      MerchantID,
      MerchantOrderNo,
    });

    const formData = new FormData();
    formData.append("MerchantID", MerchantID);
    formData.append("Version", Version);
    formData.append("RespondType", "JSON");
    formData.append("CheckValue", CheckValue);
    formData.append("TimeStamp", TimeStamp);
    formData.append("MerchantOrderNo", MerchantOrderNo);
    formData.append("Amt", Amt);

    const { data } = await this.apiInstance.post(
      "/API/QueryTradeInfo",
      formData
    );
    const Status = data.Status as string;
    const Message = data.Message as string;
    const Result = data.Result as { [key: string]: any };

    return {
      Status,
      Message,
      Result,
    };
  }

  public createPeriodicPaymentHTML(params: CreatePeriodicPaymentHTMLParams) {
    if (params.PeriodTimes > 99) {
      throw new Error("PeriodTimes must be less than 100");
    }

    const periodFirstdateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (
      params.PeriodFirstdate &&
      !periodFirstdateRegex.test(params.PeriodFirstdate)
    ) {
      throw new Error("PeriodTimes format is invalid");
    }

    const Version = "1.5";
    const TimeStamp = this.getTimeStamp();

    const tradeInfo = this.buildTradeInfo({
      RespondType: "JSON",
      TimeStamp,
      Version,
      ...params,
    });

    const html: string[] = [];
    const paymentEndpoint = `${this.apiEndpoint}/MPG/period`;
    const formId = `_auto_pay_Form_${new Date().getTime()}`;

    html.push(
      `<form id="${formId}" method="post" action="${paymentEndpoint}">`
    );
    html.push(
      `<input type="hidden" name="MerchantID_" value="${this.merchantId}" />`
    );
    html.push(`<input type="hidden" name="PostData_" value="${tradeInfo}" />`);
    html.push("</form>");

    html.push("<script>");
    html.push(`document.getElementById("${formId}").submit();`);
    html.push("</script>");

    return html.join("\n");
  }

  public async alterPeriodicPaymentStatus(
    params: AlterPeriodicPaymentStatusParams
  ) {
    const Version = "1.0";
    const TimeStamp = this.getTimeStamp();

    const PostData_ = this.buildTradeInfo({
      RespondType: "JSON",
      TimeStamp,
      Version,
      ...params,
    });

    const formData = new FormData();
    formData.append("MerchantID_", this.merchantId);
    formData.append("PostData_", PostData_);

    const { data } = await this.apiInstance.post(
      "/MPG/period/AlterStatus",
      formData
    );

    if (typeof data === "string") {
      const response = new URLSearchParams(data);
      return {
        Status: response.get("Status"),
        Message: response.get("Message"),
        Result: null,
      } as AlterPeriodicPaymentStatusResponse;
    } else {
      const period = data.period;
      const decrypted = this.decryptAESString(period);
      return JSON.parse(decrypted) as AlterPeriodicPaymentStatusResponse;
    }
  }

  public async alterPeriodicPaymentAmount(
    params: AlterPeriodicPaymentAmountParams
  ) {
    const Version = "1.2";
    const TimeStamp = this.getTimeStamp();

    const PostData_ = this.buildTradeInfo({
      RespondType: "JSON",
      TimeStamp,
      Version,
      ...params,
    });

    const formData = new FormData();
    formData.append("MerchantID_", this.merchantId);
    formData.append("PostData_", PostData_);

    const { data } = await this.apiInstance.post(
      "/MPG/period/AlterAmt",
      formData
    );

    if (typeof data === "string") {
      const response = new URLSearchParams(data);
      return {
        Status: response.get("Status"),
        Message: response.get("Message"),
        Result: null,
      } as AlterPeriodicPaymentAmountResponse;
    } else {
      const period = data.period;
      const decrypted = this.decryptAESString(period);
      return JSON.parse(decrypted) as AlterPeriodicPaymentAmountResponse;
    }
  }

  public async refundCreditCard(params: RefundCreditCardParams) {
    const Version = "1.1";
    const TimeStamp = this.getTimeStamp();

    const PostData_ = this.buildTradeInfo({
      RespondType: "JSON",
      TimeStamp,
      Version,
      ...params,
    });

    const formData = new FormData();
    formData.append("MerchantID_", this.merchantId);
    formData.append("PostData_", PostData_);

    const { data } = await this.apiInstance.post(
      "/API/CreditCard/Close",
      formData
    );
    const Status = data.Status as string;
    const Message = data.Message as string;
    const Result = data.Result as { [key: string]: any };

    return {
      Status,
      Message,
      Result,
    };
  }

  public async cancelCreditCard(params: CancelCreditCardParams) {
    const Version = "1.0";
    const TimeStamp = this.getTimeStamp();

    const PostData_ = this.buildTradeInfo({
      RespondType: "JSON",
      TimeStamp,
      Version,
      ...params,
    });

    const formData = new FormData();
    formData.append("MerchantID_", this.merchantId);
    formData.append("PostData_", PostData_);

    const { data } = await this.apiInstance.post(
      "/API/CreditCard/Cancel",
      formData
    );
    const Status = data.Status as string;
    const Message = data.Message as string;
    const Result = data.Result as { [key: string]: any };

    return {
      Status,
      Message,
      Result,
    };
  }

  public async refundEWallet(params: RefundEWalletParams) {
    const Version = "1.0";
    const TimeStamp = this.getTimeStamp();

    const data_ = JSON.stringify({
      TimeStamp,
      ...params,
    });
    const EncryptData_ = this.encryptAESString(data_);
    const HashData_ = this.buildTradeSha(EncryptData_);

    const formData = new FormData();
    formData.append("UID_", this.merchantId);
    formData.append("Version_", Version);
    formData.append("EncryptData_", EncryptData_);
    formData.append("RespondType_", "JSON");
    formData.append("HashData_", HashData_);

    const { data } = await this.apiInstance.post(
      "/API/EWallet/refund",
      formData
    );
    const Status = data.Status as string;
    const Message = data.Message as string;
    const UID = data.UID as string;
    const EncryptData = data.EncryptData as string;
    const Result = EncryptData
      ? (this.parseTradeInfo(EncryptData) as { [key: string]: any })
      : {};

    return {
      UID,
      Version,
      Status,
      Message,
      Result,
    };
  }

  /**
   * Create a new Newebpay merchant with partner API
   */
  public async addMerchant(params: AddMerchantParams) {
    if (!this.partnerId) {
      throw new Error("Please provide PartnerID");
    }

    const Version = params.Version ?? "1.8";
    const TimeStamp = this.getTimeStamp();

    const formData = new FormData();
    formData.append("PartnerID_", this.partnerId);
    formData.append(
      "PostData_",
      this.buildTradeInfo({
        TimeStamp,
        Version,
        ...params,
      })
    );

    const { data } = await this.apiInstance.post("/API/AddMerchant", formData);
    const status = data.status as string;
    const message = data.message as string;
    const result = data.result as { [key: string]: any };

    return {
      status,
      message,
      result,
    };
  }

  /**
   * Modify an existing Newebpay merchant with partner API
   */
  public async modifyMerchant(params: ModifyMerchantParams) {
    if (!this.partnerId) {
      throw new Error("Please provide PartnerID");
    }

    const Version = params.Version ?? "1.7";
    const TimeStamp = this.getTimeStamp();

    const formData = new FormData();
    formData.append("PartnerID_", this.partnerId);
    formData.append(
      "PostData_",
      this.buildTradeInfo({
        TimeStamp,
        Version,
        ...params,
      })
    );

    const { data } = await this.apiInstance.post(
      "/API/AddMerchant/modify",
      formData
    );
    const status = data.status as string;
    const message = data.message as string;
    const result = data.result as { [key: string]: any };

    return {
      status,
      message,
      result,
    };
  }

  /**
   * Charge a Newebpay merchant with partner API
   */
  public async chargeMerchant(params: AddMerchantParams) {
    if (!this.partnerId) {
      throw new Error("Please provide PartnerID");
    }

    const Version = params.Version ?? "1.1";
    const TimeStamp = this.getTimeStamp();

    const formData = new FormData();
    formData.append("PartnerID_", this.partnerId);
    formData.append(
      "PostData_",
      this.buildTradeInfo({
        TimeStamp,
        Version,
        ...params,
      })
    );

    const { data } = await this.apiInstance.post(
      "/API/ChargeInstruct",
      formData
    );

    return data as ChargeMerchantResult;
  }

  public requestCreditCardPayment = async (params: CreditCardPaymentParams) => {
    const Version = params.TokenSwitch ? "2.0" : "1.1";
    const TimeStamp = this.getTimeStamp();

    const formData = new FormData();
    formData.append("MerchantID_", this.merchantId);
    formData.append(
      "PostData_",
      this.buildTradeInfo({
        MerchantID: this.merchantId,
        TimeStamp,
        Version,
        ...params,
      })
    );
    formData.append("Pos_", "JSON");

    const { data } = await this.apiInstance.post(
      "/API/CreditCard/Close",
      formData
    );

    return data as TradeInfo;
  };

  public async authorizeTokenPayment(params: TokenPaymentParams) {
    const Version = params.Version ?? "2.4";
    const TimeStamp = this.getTimeStamp();

    const PostData_ = this.buildTradeInfo({
      MerchantID: this.merchantId,
      RespondType: "JSON",
      TimeStamp,
      Version,
      ...params,
    });

    const { data } = await this.apiInstance.post("/API/CreditCard", {
      MerchantID_: this.merchantId,
      PostData_: PostData_,
      Pos_: "JSON",
    });

    const Status = data.Status as string;
    const Message = data.Message as string;
    let Result: TokenPaymentResponse["Result"] | null = null;

    if (data.Result) {
      if (typeof data.Result === "string") {
        const decrypted = this.decryptAESString(data.Result);
        Result = JSON.parse(decrypted) as TokenPaymentResponse["Result"];
      } else {
        Result = data.Result as TokenPaymentResponse["Result"];
      }
    }

    return {
      Status,
      Message,
      Result: Result!,
    } as TokenPaymentResponse;
  }

  /**
   * 查詢約定付款綁定狀態
   *
   * @deprecated 此 API 目前還不能使用，請勿使用
   * @param params 查詢參數
   * @returns 查詢結果
   *
   * @example
   * ```typescript
   * // 目前不支援，請勿使用
   * const response = await client.queryTokenStatus({
   *   TokenTerm: "2026-01-16",
   *   TokenValue: "abc123def456"
   * });
   * ```
   */
  public async queryTokenStatus(params: QueryTokenStatusParams) {
    const Version = "1.0";
    const TimeStamp = this.getTimeStamp();

    const EncryptData_ = this.buildTradeInfo({
      MerchantID: this.merchantId,
      TimeStamp,
      TokenTerm: params.TokenTerm,
      TokenValue: params.TokenValue,
    });
    const HashData_ = this.buildTradeSha(EncryptData_);

    const { data } = await this.apiInstance.post("/API/TokenCard/query", {
      UID_: this.merchantId,
      EncryptData_: EncryptData_,
      HashData_: HashData_,
      Version_: Version,
      RespondType_: "JSON",
    });

    const Status = data.Status as string;
    const Message = data.Message as string;
    let Result: QueryTokenStatusResponse["Result"] | null = null;

    if (data.Result) {
      if (typeof data.Result === "string") {
        const decrypted = this.decryptAESString(data.Result);
        Result = JSON.parse(decrypted) as QueryTokenStatusResponse["Result"];
      } else {
        Result = data.Result as QueryTokenStatusResponse["Result"];
      }
    }

    return {
      Status,
      Message,
      Result: Result!,
    } as QueryTokenStatusResponse;
  }

  /**
   * 解除約定付款綁定
   *
   * @deprecated 此 API 目前還不能使用，請勿使用
   * @param params 解除綁定參數
   * @returns 解除綁定結果
   *
   * @example
   * ```typescript
   * // 目前不支援，請勿使用
   * const response = await client.unbindToken({
   *   TokenTerm: "2026-01-16",
   *   TokenValue: "abc123def456"
   * });
   * ```
   */
  public async unbindToken(params: UnbindTokenParams) {
    const Version = "1.0";
    const TimeStamp = this.getTimeStamp();

    const PostData_ = this.buildTradeInfo({
      MerchantID: this.merchantId,
      TimeStamp,
      TokenTerm: params.TokenTerm,
      TokenValue: params.TokenValue,
    });
    const HashData_ = this.buildTradeSha(PostData_);

    const { data } = await this.apiInstance.post("/API/TokenCard/unbinding", {
      UID_: this.merchantId,
      EncryptData_: PostData_,
      HashData_: HashData_,
      Version_: Version,
      RespondType_: "JSON",
    });

    const Status = data.Status as string;
    const Message = data.Message as string;
    let Result: UnbindTokenResponse["Result"] | null = null;

    if (data.Result) {
      if (typeof data.Result === "string") {
        const decrypted = this.decryptAESString(data.Result);
        Result = JSON.parse(decrypted) as UnbindTokenResponse["Result"];
      } else {
        Result = data.Result as UnbindTokenResponse["Result"];
      }
    }

    return {
      Status,
      Message,
      Result: Result!,
    } as UnbindTokenResponse;
  }

  /**
   * 嵌入式信用卡支付頁 P1 首次交易
   *
   * 使用前端 SDK 取得的 Prime 進行信用卡授權交易。
   * 若啟用綁卡功能 (TokenSwitch="get")，成功後會回傳 TokenValue 供後續約定付款使用。
   * 若啟用 3D 驗證 (P3D="1")，回傳會是 URL encoded HTML 字串。
   *
   * @param params 交易參數，包含 Prime、訂單資訊等
   * @returns 交易結果，包含授權資訊、TokenValue（若有綁卡）或 3D HTML
   *
   * @example
   * ```typescript
   * // 一般交易
   * const result = await client.embeddedCreditCardPayment({
   *   Prime: "從前端 SDK 取得的 Prime",
   *   MerchantOrderNo: "Order_123",
   *   Amt: 100,
   *   ProdDesc: "測試商品",
   *   PayerEmail: "test@example.com",
   *   CardHolderName: "Test User"
   * });
   *
   * // 3D 驗證交易
   * const result = await client.embeddedCreditCardPayment({
   *   Prime: "從前端 SDK 取得的 Prime",
   *   MerchantOrderNo: "Order_123",
   *   Amt: 100,
   *   ProdDesc: "測試商品",
   *   PayerEmail: "test@example.com",
   *   CardHolderName: "Test User",
   *   P3D: "1",
   *   NotifyURL: "https://example.com/notify",
   *   ReturnURL: "https://example.com/return"
   * });
   * if (is3DResponse(result)) {
   *   const html = client.decode3DHTML(result.Result);
   *   // 將 HTML 注入頁面執行 3D 驗證
   * }
   *
   * // 綁卡交易
   * const result = await client.embeddedCreditCardPayment({
   *   Prime: "從前端 SDK 取得的 Prime",
   *   MerchantOrderNo: "Order_123",
   *   Amt: 100,
   *   ProdDesc: "測試商品",
   *   PayerEmail: "test@example.com",
   *   CardHolderName: "Test User",
   *   TokenSwitch: "get",
   *   TokenTerm: "user@example.com"
   * });
   * // 成功後 result.Result.TokenValue 可用於後續約定付款
   * ```
   */
  public async embeddedCreditCardPayment(
    params: EmbeddedPaymentParams
  ): Promise<EmbeddedPaymentResponse> {
    const { Prime, ...restParams } = params;
    const TimeStamp = Date.now();
    const Version = "2.4";

    const requestBody = {
      MerchantID: this.merchantId,
      TimeStamp,
      Version,
      ...restParams,
    };

    const { data } = await this.inframeInstance.post(
      "/NWPJCore/PaymentC",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${Prime}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data as EmbeddedPaymentResponse;
  }

  /**
   * 解碼 3D 驗證 HTML
   *
   * 當 P3D=1 時，API 回傳 URL encoded HTML 字串，使用此方法解碼。
   *
   * @param encodedHtml URL encoded HTML 字串
   * @returns 解碼後的 HTML 字串
   *
   * @example
   * ```typescript
   * const response = await client.embeddedCreditCardPayment({ P3D: "1", ... });
   * if (is3DResponse(response)) {
   *   const html = client.decode3DHTML(response.Result);
   *   // 前端：document.write(html) 或注入到 iframe
   * }
   * ```
   */
  public decode3DHTML(encodedHtml: string): string {
    return decodeURIComponent(encodedHtml.replace(/\+/g, " "));
  }

  /**
   * 檢查回應是否為 3D 驗證回應
   *
   * @param response API 回應
   * @returns 是否為 3D 驗證回應
   */
  public is3DResponse(response: EmbeddedPaymentResponse): boolean {
    return is3DResponse(response);
  }

  /**
   * 嵌入式信用卡支付頁 Pn 後續約定付款
   *
   * 使用 P1 交易取得的 TokenValue 進行後續約定扣款。
   * 不需要消費者再次輸入卡號。
   *
   * @param params 交易參數，包含 TokenValue、TokenTerm、訂單資訊等
   * @returns 交易結果
   *
   * @example
   * ```typescript
   * const result = await client.embeddedTokenPayment({
   *   TokenValue: "從 P1 回應取得的 TokenValue",
   *   TokenTerm: "user@example.com", // 與 P1 相同
   *   MerchantOrderNo: "Order_456",
   *   Amt: 100,
   *   ProdDesc: "續費商品"
   * });
   * ```
   */
  public async embeddedTokenPayment(
    params: EmbeddedTokenPaymentParams
  ): Promise<EmbeddedPaymentResponse> {
    const TimeStamp = Date.now();
    const Version = "2.0";

    const requestBody = {
      MerchantID: this.merchantId,
      TimeStamp,
      Version,
      TokenSwitch: "on" as const,
      ...params,
    };

    const { data } = await this.inframeInstance.post(
      "/NWPJCore/PaymentTC",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${this.hashKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data as EmbeddedPaymentResponse;
  }

  public buildTradeInfo(params: { [key: string]: any }) {
    const postData = new URLSearchParams(params).toString();
    const encrypted = this.encryptAESString(postData);
    return encrypted;
  }

  public encryptAESString(plainText: string) {
    const cipher = crypto.createCipheriv("aes256", this.hashKey, this.hashIV);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  public buildTradeSha(tradeInfo: string) {
    const hashData = `HashKey=${this.hashKey}&${tradeInfo}&HashIV=${this.hashIV}`;
    const encrypted = crypto
      .createHash("sha256")
      .update(hashData)
      .digest("hex")
      .toUpperCase();
    return encrypted;
  }

  public buildCheckCode(params: { [key: string]: any }) {
    const data = Object.keys(params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = params[key];
        return obj;
      }, {} as { [key: string]: any });

    const paramsStr = new URLSearchParams(data).toString();
    const checkStr = `HashIV=${this.hashIV}&${paramsStr}&HashKey=${this.hashKey}`;

    return crypto
      .createHash("sha256")
      .update(checkStr)
      .digest("hex")
      .toUpperCase();
  }

  public buildCheckValue(params: { [key: string]: any }) {
    const data = Object.keys(params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = params[key];
        return obj;
      }, {} as { [key: string]: any });

    const paramsStr = new URLSearchParams(data).toString();
    const checkStr = `IV=${this.hashIV}&${paramsStr}&Key=${this.hashKey}`;

    return crypto
      .createHash("sha256")
      .update(checkStr)
      .digest("hex")
      .toUpperCase();
  }

  public parseCreatePeriodicPaymentResponse(rawResponse: string) {
    const decrypted = this.decryptAESString(rawResponse);
    return JSON.parse(decrypted) as CreatePeriodicPaymentResponse;
  }

  public parsePeriodicPaymentResponse(rawResponse: string) {
    const decrypted = this.decryptAESString(rawResponse);
    return JSON.parse(decrypted) as PeriodicPaymentResponse;
  }

  private getTimeStamp() {
    return Math.floor(new Date().getTime() / 1000).toString();
  }

  private createApiInstance({
    apiEndpoint,
    proxyEndpoint,
    proxySecret,
    userAgent,
    defaultHeaders,
  }: {
    apiEndpoint: string;
    proxyEndpoint?: string;
    proxySecret?: string;
    userAgent?: string;
    defaultHeaders?: AxiosRequestHeaders;
  }): AxiosInstance {
    const apiRequestHeaders: AxiosRequestHeaders = defaultHeaders ?? {};
    if (userAgent) {
      apiRequestHeaders["User-Agent"] = userAgent;
    }
    if (proxyEndpoint && proxySecret) {
      apiRequestHeaders["x-proxy-type"] = "custom";
      apiRequestHeaders["x-proxy-secret"] = proxySecret;
      apiRequestHeaders["x-proxy-target-endpoint"] = this.apiEndpoint;

      return axios.create({
        baseURL: proxyEndpoint,
        headers: apiRequestHeaders,
      });
    } else {
      return axios.create({
        baseURL: apiEndpoint,
        headers: apiRequestHeaders,
      });
    }
  }
}

export default NewebpayClient;
