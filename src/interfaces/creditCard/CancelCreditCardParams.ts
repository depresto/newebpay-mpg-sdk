export type CancelCreditCardParams =
  | {
      Amt: number;
      MerchantOrderNo: string;
      IndexType: 1;
      TradeNo?: string;
    }
  | {
      Amt: number;
      MerchantOrderNo?: string;
      IndexType: 2;
      TradeNo: string;
    };
