import NewebpayClient from "./newebpay.client";

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

  ExpireDate?: string;
  BankCode?: string;

  TokenValue?: string;
  TokenLife?: string;
};

export type PaymentParams = {
  Version?: string;
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

  CREDITAGREEMENT?: 1;
  ANDROIDPAYAGREEMENT?: 1;
  SAMSUNGPAYAGREEMENT?: 1;
  TokenTerm?: string;
  TokenLife?: string;
};

export type QueryTradeInfoParams = {
  MerchantOrderNo: string;
  Amt: number;
  Gateway?: "Composite";
};

export type RefundCreditCardParams = {
  Amt: number;
  MerchantOrderNo: string;
  IndexType: 1 | 2;
  TradeNo: string;
  CloseType: 1 | 2;
  Cancel?: 1;
};

export type RefundEWalletParams = {
  MerchantOrderNo: string;
  Amount: number;
  PaymentType:
    | "ESUNWALLET"
    | "LINEPAY"
    | "TAIWANPAY"
    | "EZPAY"
    | "EZPALIPAY"
    | "EZPWECHAT";
};

export type AddMerchantParams = {
  Version?: "2.0" | string;
  MemberUnified: string;
  RepresentName?: string;
  ManagerID?: string;
  IDCardDate?: string;
  IDCardPlace?: string;
  IDPic?: 0 | 1;
  IDFrom?: 1 | 2 | 3;
  Date?: string;
  CapitalAmount?: string;
  IncorporationDate?: string;
  CompanyAddress?: string;
  MemberName: string;
  MemberPhone: string;
  MemberAddress: string;
  ManagerName: string;
  ManagerNameE: string;
  LoginAccount: string;
  ManagerMobile: string;
  ManagerEmail: string;
  DisputeMail: string;
  MerchantEmail: string;
  MerchantID: string;
  MCType: string;
  MerchantName: string;
  MerchantNameE?: string;
  MerchantWebURL: string;
  MerchantAddrCity: string;
  MerchantAddrArea: string;
  MerchantAddrCode: string;
  MerchantAddr: string;
  MerchantEnAddr: string;
  NationalE?: string;
  CityE?: string;
  MerchantType: 1 | 2 | 3 | 4;
  BusinessType: string;
  MerchantDesc: string;
  BankCode: string;
  SubBankCode: string;
  BankAccount: string;
  AccountName?: string;
  CreditAutoType?: 0 | 1;
  CreditLimit?: number;
  PaymentType?: string;
  AgreedFee?: string;
  AgreedDay?: string;
  Withdraw?: "1" | "2" | "3" | "4" | "9";
  WithdrawMer?: "1" | "2" | "3" | "4";
  WithdrawSetting?: string;
  Shipping?: "1" | "2" | "3";
  ShippingName?: string;
  ShippingTel?: string;
  ShippingEmail?: string;
  ReturnURL?: string;
  NotifyURL?: string;
};

export type CreditCardAgreementTokenParams = PaymentParams & {
  Version?: "2.0";
  CREDITAGREEMENT?: 1;
  ANDROIDPAYAGREEMENT?: 1;
  SAMSUNGPAYAGREEMENT?: 1;
  TokenTerm?: string;
  TokenLife?: string;
};

export type CreditCardPaymentParams = {
  Version?: "1.1" | "2.0";
  MerchantID?: string;
  P3D?: 0 | 1;
  NotifyURL?: string;
  ReturnURL?: string;
  MerchantOrderNo: string;
  Amt: number;
  ProdDesc: string;
  PayerEmail: string;
  Inst?: 0 | 3 | 6 | 12 | 18 | 24 | 30;
  Red?: 0 | 1;
  CardAE?: 0 | 1;
  CardNo?: string;
  Exp?: string;
  CVC?: string;
  APPLEPAY?: string;
  APPLEPAYTYPE?: "01" | "02";
  ANDROIDPAY?: string;
  SAMSUNGPAY?: string;
  NTCB?: 0 | 1;
  NTCBArea?: string;
  NTCBStart?: string;
  NTCBEnd?: string;
  TokenValue?: string;
  TokenTerm?: string;
  TokenSwitch?: "on" | "get";
  TokenLife?: string;
};

export default NewebpayClient;
