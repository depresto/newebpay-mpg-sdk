import crypto from "crypto";
import axios, { AxiosRequestHeaders } from "axios";
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
  GetPaymentFormHTMLParams,
  ModifyMerchantParams,
  PeriodicPaymentResponse,
  QueryTradeInfoParams,
  QueryTokenStatusParams,
  QueryTokenStatusResponse,
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
  env: "sandbox" | "production";
  proxySecret?: string;
  userAgent?: string;

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
    this.proxySecret = params.options?.proxySecret;
    this.apiEndpoint = params.options?.proxyEndpoint
      ? params.options.proxyEndpoint
      : isDryRun
      ? "https://ccore.newebpay.com"
      : "https://core.newebpay.com";
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

    const { data } = await this.sendApiRequest({
      apiPath: "/API/QueryTradeInfo",
      data: formData,
    });
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

    const { data } = await this.sendApiRequest({
      apiPath: "/MPG/period/AlterStatus",
      data: formData,
    });

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

    const { data } = await this.sendApiRequest({
      apiPath: "/MPG/period/AlterAmt",
      data: formData,
    });

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

    const { data } = await this.sendApiRequest({
      apiPath: "/API/CreditCard/Close",
      data: formData,
    });
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

    const { data } = await this.sendApiRequest({
      apiPath: "/API/CreditCard/Cancel",
      data: formData,
    });
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

    const { data } = await this.sendApiRequest({
      apiPath: "/API/EWallet/refund",
      data: formData,
    });
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

    const { data } = await this.sendApiRequest({
      apiPath: "/API/AddMerchant",
      data: formData,
    });
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

    const { data } = await this.sendApiRequest({
      apiPath: "/API/AddMerchant/modify",
      data: formData,
    });
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

    const { data } = await this.sendApiRequest({
      apiPath: "/API/ChargeInstruct",
      data: formData,
    });

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

    const { data } = await this.sendApiRequest({
      apiPath: "/API/CreditCard/Close",
      data: formData,
    });

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

    const { data } = await this.sendApiRequest({
      apiPath: "/API/CreditCard",
      data: {
        MerchantID_: this.merchantId,
        PostData_: PostData_,
        Pos_: "JSON",
      },
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

    const { data } = await this.sendApiRequest({
      apiPath: "/API/TokenCard/query",
      data: {
        UID_: this.merchantId,
        EncryptData_: EncryptData_,
        HashData_: HashData_,
        Version_: Version,
        RespondType_: "JSON",
      },
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

    const { data } = await this.sendApiRequest({
      apiPath: "/API/TokenCard/unbinding",
      data: {
        UID_: this.merchantId,
        EncryptData_: PostData_,
        HashData_: HashData_,
        Version_: Version,
        RespondType_: "JSON",
      },
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

  public sendApiRequest = async (params: { apiPath: string; data: any }) => {
    const headers: AxiosRequestHeaders = {
      "Content-Type": "multipart/form-data",
    };
    if (this.userAgent) {
      headers["User-Agent"] = this.userAgent;
    }
    if (this.proxySecret) {
      headers["x-proxy-secret"] = this.proxySecret;
      headers["x-proxy-type"] = "newebpay";
      headers["x-proxy-env"] = this.env;
    }

    return await axios({
      method: "post",
      url: `${this.apiEndpoint}${params.apiPath}`,
      data: params.data,
      headers,
    });
  };

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
}

export default NewebpayClient;
