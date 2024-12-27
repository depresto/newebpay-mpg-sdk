export type ChargeMerchantParams = {
  MerchantID: string;
  MerTrade?: string;
  Amount: number;
  FeeType: "0" | "1" | "2" | "3" | "4";
  BalanceType: "0" | "1";
  AppointMerID?: string;
};
