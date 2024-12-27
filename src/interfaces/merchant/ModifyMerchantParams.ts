import { AddMerchantParams } from "./AddMerchantParams";

export type ModifyMerchantParams = Partial<AddMerchantParams> & {
  Version?: "1.7" | string;
  MerchantID: string;
};
