import { TradeInfoResult } from "./TradeInfoResult";

export type TradeInfo = {
  Status: "SUCCESS" | string;
  Message: string;
  Result: TradeInfoResult | string;
};
