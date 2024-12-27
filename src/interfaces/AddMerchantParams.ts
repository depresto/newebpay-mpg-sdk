export type AddMerchantParams = {
  Version?: "2.0" | string;
  MemberUnified: string;
  RepresentName?: string;
  ManagerID?: string;
  IDCardDate?: string;
  IDCardPlace?: string;
  IDPic?: 0 | 1;
  IDFrom?: 1 | 2 | 3;
  Date?: string;
  CapitalAmount?: string;
  IncorporationDate?: string;
  CompanyAddress?: string;
  MemberName: string;
  MemberPhone: string;
  MemberAddress: string;
  ManagerName: string;
  ManagerNameE: string;
  LoginAccount: string;
  ManagerMobile: string;
  ManagerEmail: string;
  DisputeMail: string;
  MerchantEmail: string;
  MerchantID: string;
  MCType: string;
  MerchantName: string;
  MerchantNameE?: string;
  MerchantWebURL: string;
  MerchantAddrCity: string;
  MerchantAddrArea: string;
  MerchantAddrCode: string;
  MerchantAddr: string;
  MerchantEnAddr: string;
  NationalE?: string;
  CityE?: string;
  MerchantType: 1 | 2 | 3 | 4;
  BusinessType: string;
  MerchantDesc: string;
  BankCode: string;
  SubBankCode: string;
  BankAccount: string;
  AccountName?: string;
  CreditAutoType?: 0 | 1;
  CreditLimit?: number;
  PaymentType?: string;
  AgreedFee?: string;
  AgreedDay?: string;
  Withdraw?: "1" | "2" | "3" | "4" | "9";
  WithdrawMer?: "1" | "2" | "3" | "4";
  WithdrawSetting?: string;
  Shipping?: "1" | "2" | "3";
  ShippingName?: string;
  ShippingTel?: string;
  ShippingEmail?: string;
  ReturnURL?: string;
  NotifyURL?: string;
};