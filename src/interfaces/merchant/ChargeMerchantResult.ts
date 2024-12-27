export type ChargeMerchantResult = {
  Status: "SUCCESS" | string;
  Message: string;
  MerchantID: string;
  FundTime: string;
  MerTrade: string;
  ExeNo: string;
};