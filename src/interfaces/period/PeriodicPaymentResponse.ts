export type PeriodicPaymentResponseResult = {
  RespondCode: "00" | string;
  MerchantID: string;
  MerchantOrderNo: string;
  OrderNo: string
  TradeNo: string;
  AuthDate: string
  TotalTimes: string
  AlreadyTimes: string
  AuthAmt: number
  AuthCode: string
  EscrowBank: string
  AuthBank: string
  NextAuthDate: string
  PeriodNo: string
};

export type PeriodicPaymentResponse = {
  Status: "SUCCESS" | string;
  Message: string;
  Result: PeriodicPaymentResponseResult;
};
