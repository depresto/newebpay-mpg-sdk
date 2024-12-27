export type RefundCreditCardParams =
  | {
      Amt: number;
      MerchantOrderNo: string;
      IndexType: 1;
      TradeNo?: string;
      CloseType: 1 | 2;
      Cancel?: 1;
    }
  | {
      Amt: number;
      MerchantOrderNo?: string;
      IndexType: 2;
      TradeNo: string;
      CloseType: 1 | 2;
      Cancel?: 1;
    };
