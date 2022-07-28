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


export class NewebpayClient {
  constructor(params: {
    merchantId: string;
    hashKey: string;
    hashIV: string;
    env: "sandbox" | "production";
    version?: string;
  });

  public parseTradeInfo(tradeInfo: string): TradeInfo
  public getPaymentFormHTML(params: RequestData): string
}
