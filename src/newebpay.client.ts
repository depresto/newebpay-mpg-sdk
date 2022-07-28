import crypto from "crypto";

export type RequestData = {
  RespondType?: "JSON" | "String";
  LangType?: "zh-tw" | "en" | "jp";
  MerchantOrderNo: string;
  Amt: number;
  ItemDesc: string;
  TradeLimit?: number;
  ExpireDate?: string;
  ReturnURL?: string;
  NotifyURL?: string;
  CustomerURL?: string;
  ClientBackURL?: string;
  Email?: string;
  EmailModify?: 0 | 1;
  LoginType?: 0 | 1;
  OrderComment?: string;
  CREDIT?: 0 | 1;
  ANDROIDPAY?: 0 | 1;
  SAMSUNGPAY?: 0 | 1;
  LINEPAY?: 0 | 1;
  ImageUrl?: string;
  InstFlag?: "1" | string;
  CreditRed?: 0 | 1;
  UNIONPAY?: 0 | 1;
  WEBATM?: 0 | 1;
  VACC?: 0 | 1;
  BankType?: string;
  CVS?: 0 | 1;
  BARCODE?: 0 | 1;
  ESUNWALLET?: 0 | 1;
  TAIWANPAY?: 0 | 1;
  CVSCOM?: 0 | 1;
  EZPAY?: 0 | 1;
  EZPWECHAT?: 0 | 1;
  EZPALIPAY?: 0 | 1;
  LgsType?: "B2C" | "C2C";
};

export type TradeInfo = {
  Status: "SUCCESS" | string;
  Message: string;
  Result: TradeInfoResult | string;
};
export type TradeInfoResult = {
  MerchantID: string;
  Amt: number;
  TradeNo: string;
  MerchantOrderNo: string;
  PaymentType: string;
  RespondType: string;
  PayTime: string;
  IP: string;
  EscrowBank: string;
  AuthBank?: string;
  RespondCode?: string;
  Auth?: string;
  Card6No?: string;
  Card4No?: string;
  Inst?: number;
  InstEach?: number;
  ECI?: string;
  TokenUseStatus?: 0 | 1 | 2 | 9;
  RedAmt?: number;
  PaymentMethod?: string;
  DCC_Amt?: number;
  DCC_Rate?: number;
  DCC_Markup?: number;
  DCC_Currency?: string;
  DCC_Currency_Code?: number;
  PayBankCode?: string;
  PayerAccount5Code?: string;
  CodeNo?: string;
  StoreType?: 1 | 2 | 3 | 4 | string;
  StoreID?: string;
  Barcode_1?: string;
  Barcode_2?: string;
  Barcode_3?: string;
  PayStore?: string;
  StoreCode?: string;
  StoreName?: string;
  StoreAddr?: string;
  TradeType?: 1 | 2;
  CVSCOMName?: string;
  CVSCOMPhone?: string;
  LgsNo?: string;
  LgsType?: string;
  ChannelID?: string;
  ChannelNo?: string;
  PayAmt?: number;
  RedDisAmt?: number;
};

class NewebpayClient {
  version = "2.0";
  merchantId: string;
  hashKey: string;
  hashIV: string;
  dryRun: boolean;
  constructor(params: {
    merchantId: string;
    hashKey: string;
    hashIV: string;
    env: "sandbox" | "production";
    version?: string;
  }) {
    this.merchantId = params.merchantId;
    this.hashKey = params.hashKey;
    this.hashIV = params.hashIV;
    this.dryRun = params.env === "sandbox";

    if (params.version) {
      this.version = params.version;
    }
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

  public getPaymentFormHTML(params: RequestData): string {
    const tradeInfo = this.buildTradeInfo({
      MerchantID: this.merchantId,
      RespondType: "JSON",
      TimeStamp: Math.floor(new Date().getTime() / 1000),
      Version: this.version,
      LangType: "zh-tw",
      ...params,
    });
    const tradeSha = this.buildTradeSha(tradeInfo);

    const html: string[] = [];
    const paymentEndpoint =
      this.dryRun === true
        ? "https://ccore.newebpay.com/MPG/mpg_gateway"
        : "https://core.newebpay.com/MPG/mpg_gateway";
    const formId = `_auto_pay_Form_${new Date().getTime()}`;
    html.push(
      `<form id="${formId}" method="post" action="${paymentEndpoint}">`
    );

    html.push(
      `<input type="hidden" name="MerchantID" value="${this.merchantId}" />`
    );
    html.push(`<input type="hidden" name="Version" value="${this.version}" />`);
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
