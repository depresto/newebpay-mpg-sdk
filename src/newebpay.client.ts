import crypto from "crypto";
import axios from "axios";
import FormData from "form-data";
import { AddMerchantParams, PaymentParams, TradeInfo } from ".";

class NewebpayClient {
  partnerId: string | null;
  merchantId: string;
  hashKey: string;
  hashIV: string;
  dryRun: boolean;
  apiEndpoint: string;

  constructor(params: {
    partnerId?: string;
    merchantId: string;
    hashKey: string;
    hashIV: string;
    env: "sandbox" | "production";
    proxyEndpoint?: string;
  }) {
    this.partnerId = params.partnerId ?? null;
    this.merchantId = params.merchantId;
    this.hashKey = params.hashKey;
    this.hashIV = params.hashIV;
    this.dryRun = params.env === "sandbox";

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
    const paymentUrl = `${this.apiEndpoint}//MPG/mpg_gateway`;
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

    const { data } = await axios({
      method: "post",
      url: `${this.apiEndpoint}/API/AddMerchant`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    const status = data.status as string;
    const message = data.message as string;
    const result = JSON.parse(data.result || "{}") as { [key: string]: any };

    return {
      status,
      message,
      result,
    };
  }
}

export default NewebpayClient;
