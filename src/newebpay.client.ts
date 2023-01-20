import crypto from "crypto";
import axios, { AxiosRequestHeaders } from "axios";
import FormData from "form-data";
import {
  AddMerchantParams,
  CreditCardAgreementTokenParams,
  CreditCardPaymentParams,
  CreditCardTokenPaymentParams,
  PaymentParams,
  QueryTradeInfoParams,
  RefundCreditCardParams,
  RefundEWalletParams,
  TradeInfo,
} from ".";

class NewebpayClient {
  partnerId: string | null;
  merchantId: string;
  hashKey: string;
  hashIV: string;
  dryRun: boolean;
  apiEndpoint: string;
  proxySecret?: string;

  constructor(params: {
    partnerId?: string;
    merchantId: string;
    hashKey: string;
    hashIV: string;
    env: "sandbox" | "production";
    proxyEndpoint?: string;
    proxySecret?: string;
  }) {
    this.partnerId = params.partnerId ?? null;
    this.merchantId = params.merchantId;
    this.hashKey = params.hashKey;
    this.hashIV = params.hashIV;
    this.dryRun = params.env === "sandbox";

    this.proxySecret = params.proxySecret;
    this.apiEndpoint = params.proxyEndpoint
      ? params.proxyEndpoint
      : this.dryRun === true
      ? "https://ccore.newebpay.com"
      : "https://core.newebpay.com";
  }

  private buildTradeInfo(params: { [key: string]: any }) {
    const postData = new URLSearchParams(params).toString();
    const cipher = crypto.createCipheriv("aes256", this.hashKey, this.hashIV);
    let encrypted = cipher.update(postData, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  private buildTradeSha(tradeInfo: string) {
    const hashData = `HashKey=${this.hashKey}&${tradeInfo}&HashIV=${this.hashIV}`;
    const encrypted = crypto
      .createHash("sha256")
      .update(hashData)
      .digest("hex")
      .toUpperCase();
    return encrypted;
  }

  /**
   * Parse TradeInfo string from API
   *
   * @param tradeInfo - API TradeInfo string
   */
  public parseTradeInfo(tradeInfo: string) {
    const decipher = crypto.createDecipheriv(
      "aes256",
      this.hashKey,
      this.hashIV
    );
    decipher.setAutoPadding(false);
    let decrypted = decipher.update(tradeInfo, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted.replace(/[\x00-\x20]+/g, "")) as TradeInfo;
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

  /**
   * Generate Newebpay payment HTML form
   */
  public getPaymentFormHTML(params: PaymentParams): string {
    return this.getFormHTML(params);
  }

  public async queryTradeInfo(params: QueryTradeInfoParams) {
    const { Amt, MerchantOrderNo } = params;
    const MerchantID = this.merchantId;
    const Version = "1.3";
    const TimeStamp = Math.floor(new Date().getTime() / 1000).toString();
    const CheckCode = this.buildCheckCode({ Amt, MerchantID, MerchantOrderNo });

    const formData = new FormData();
    formData.append("MerchantID", MerchantID);
    formData.append("Version", Version);
    formData.append("RespondType", "JSON");
    formData.append("CheckValue", CheckCode);
    formData.append("TimeStamp", TimeStamp);
    formData.append("MerchantOrderNo", MerchantOrderNo);
    formData.append("Amt", Amt);

    const { data } = await axios({
      method: "post",
      url: `${this.apiEndpoint}/API/QueryTradeInfo`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
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

  public async refundCreditCard(params: RefundCreditCardParams) {
    const PostData_ = this.buildTradeInfo({
      RespondType: "JSON",
      TimeStamp: Math.floor(new Date().getTime() / 1000),
      Version: "1.1",
      ...params,
    });

    const formData = new FormData();
    formData.append("MerchantID_", this.merchantId);
    formData.append("PostData_", PostData_);

    const { data } = await axios({
      method: "post",
      url: `${this.apiEndpoint}/API/CreditCard/Close`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
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
    const EncryptData_ = this.buildTradeInfo({
      TimeStamp: Math.floor(new Date().getTime() / 1000),
      ...params,
    });
    const HashData_ = this.buildTradeSha(EncryptData_);

    const formData = new FormData();
    formData.append("UID_", this.merchantId);
    formData.append("Version_", "1.0");
    formData.append("EncryptData_", EncryptData_);
    formData.append("RespondType_", "JSON");
    formData.append("HashData_", HashData_);

    const { data } = await axios({
      method: "post",
      url: `${this.apiEndpoint}/API/EWallet/refund`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    const Status = data.Status as string;
    const Message = data.Message as string;
    const UID = data.UID as string;
    const Version = data.Version as string;
    const EncryptData = data.EncryptData as string;
    const Result = this.parseTradeInfo(EncryptData) as { [key: string]: any };

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

    const formData = new FormData();
    formData.append("PartnerID_", this.partnerId);
    formData.append(
      "PostData_",
      this.buildTradeInfo({
        TimeStamp: Math.floor(new Date().getTime() / 1000),
        Version: params.Version ?? "1.8",
        ...params,
      })
    );

    const headers: AxiosRequestHeaders = {};
    headers["Content-Type"] = "multipart/form-data";
    if (this.proxySecret) headers["proxy-secret"] = this.proxySecret;

    const { data } = await axios({
      method: "post",
      url: `${this.apiEndpoint}/API/AddMerchant`,
      data: formData,
      headers,
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

  public getCreditCardAgreementTokenFormHTML = (
    params: CreditCardAgreementTokenParams
  ) => {
    return this.getFormHTML(params);
  };

  public requestCreditCardPayment = async (params: CreditCardPaymentParams) => {
    const formData = new FormData();
    formData.append("MerchantID_", this.merchantId);
    formData.append(
      "PostData_",
      this.buildTradeInfo({
        MerchantID: this.merchantId,
        TimeStamp: Math.floor(new Date().getTime() / 1000),
        Version: "1.1",
        ...params,
      })
    );
    formData.append("Pos_", "JSON");

    const headers: AxiosRequestHeaders = {};
    headers["Content-Type"] = "multipart/form-data";
    if (this.proxySecret) headers["proxy-secret"] = this.proxySecret;

    const response = await axios({
      method: "post",
      url: `${this.apiEndpoint}/API/CreditCard`,
      data: formData,
      headers,
    });

    const data = response.data as TradeInfo;
    return data;
  };

  public requestCreditCardTokenPayment = async (
    params: CreditCardTokenPaymentParams
  ) => {
    const formData = new FormData();
    formData.append("MerchantID_", this.merchantId);
    formData.append(
      "PostData_",
      this.buildTradeInfo({
        MerchantID: this.merchantId,
        TimeStamp: Math.floor(new Date().getTime() / 1000),
        Version: "2.0",
        P3D: 0,
        ...params,
      })
    );
    formData.append("Pos_", "JSON");

    const headers: AxiosRequestHeaders = {};
    headers["Content-Type"] = "multipart/form-data";
    if (this.proxySecret) headers["proxy-secret"] = this.proxySecret;

    const response = await axios({
      method: "post",
      url: `${this.apiEndpoint}/API/CreditCard`,
      data: formData,
      headers,
    });

    const data = response.data as TradeInfo;
    return data;
  };

  private getFormHTML(params: any): string {
    const Version = params.Version ?? "2.0";
    const tradeInfo = this.buildTradeInfo({
      MerchantID: this.merchantId,
      RespondType: "JSON",
      TimeStamp: Math.floor(new Date().getTime() / 1000),
      Version,
      LangType: "zh-tw",
      ...params,
    });
    const tradeSha = this.buildTradeSha(tradeInfo);

    const html: string[] = [];
    const paymentUrl = `${this.apiEndpoint}/MPG/mpg_gateway`;
    const formId = `_auto_pay_Form_${new Date().getTime()}`;

    html.push(`<form id="${formId}" method="post" action="${paymentUrl}">`);
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
}

export default NewebpayClient;
