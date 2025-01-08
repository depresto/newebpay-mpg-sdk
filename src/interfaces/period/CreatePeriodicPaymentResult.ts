export type CreatePeriodicPaymentResponse = {
  Status: "SUCCESS" | string;
  Message: string;
  Result: CreatePeriodicPaymentResult;
}

export type CreatePeriodicPaymentResult =
  | DefaultPeriodicPaymentResult
  | (DefaultPeriodicPaymentResult & AuthorizedPeriodicPaymentResult);

type DefaultPeriodicPaymentResult = {
  MerchantID: string;
  MerchantOrderNo: string;
  PeriodType: "D" | "W" | "M" | "Y";
  AuthTimes: number;
  DateArray: string;
  PeriodAmt: number;
  PeriodNo: string;
};

type AuthorizedPeriodicPaymentResult = {
  AuthTime: string;
  TradeNo: string;
  CardNo: string;
  AuthCode: string;
  RespondCode: "00" | string;
  EscrowBank: string;
  AuthBank: string;
  PaymentMethod: "CREDIT" | "UNIONPAY";
};
