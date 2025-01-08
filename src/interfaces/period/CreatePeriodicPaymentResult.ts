export type CreatePeriodicPaymentResult =
  | DefaultPeriodicPaymentResult
  | (DefaultPeriodicPaymentResult & AuthorizedPeriodicPaymentResult);

type DefaultPeriodicPaymentResult = {
  MerchantID: string;
  MerchantOrderNo: string;
  PeriodType: string;
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
  RespondCode: string;
  EscrowBank: string;
  AuthBank: string;
  PaymentMethod: string;
};
