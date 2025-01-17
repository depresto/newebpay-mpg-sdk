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

  ExpireDate?: string;
  BankCode?: string;

  TokenValue?: string;
  TokenLife?: string;
};
