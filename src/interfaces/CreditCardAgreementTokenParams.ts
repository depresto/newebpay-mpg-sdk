import { GetPaymentFormHTMLParams } from "./GetPaymentFormHTMLParams";

export type CreditCardAgreementTokenParams = GetPaymentFormHTMLParams & {
  Version?: "2.0";
  CREDITAGREEMENT?: 1;
  ANDROIDPAYAGREEMENT?: 1;
  SAMSUNGPAYAGREEMENT?: 1;
  TokenTerm?: string;
  TokenLife?: string;
};
