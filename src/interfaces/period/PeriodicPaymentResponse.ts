export type PeriodicPaymentResponseResult = {
  MerchantID: string;
  MerchantOrderNo: string;
  PeriodType: "D" | "W" | "M" | "Y";
  AuthTimes: number;
  DateArray: string;
  PeriodAmt: number;
  PeriodNo: string;

  AuthTime?: string;
  TradeNo?: string;
  CardNo?: string;
  AuthCode?: string;
  RespondCode?: "00" | string;
  EscrowBank?: string;
  AuthBank?: string;
  PaymentMethod?: "CREDIT" | "UNIONPAY";
};

export type PeriodicPaymentResponse = {
  Status: "SUCCESS" | string;
  Message: string;
  Result: PeriodicPaymentResponseResult;
};
