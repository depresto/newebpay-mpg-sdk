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
