import { GetPaymentFormHTMLParams } from "../mpg/GetPaymentFormHTMLParams";

export type CreditCardAgreementTokenParams = GetPaymentFormHTMLParams & {
  Version?: "2.0";
  CREDITAGREEMENT?: 1;
  ANDROIDPAYAGREEMENT?: 1;
  SAMSUNGPAYAGREEMENT?: 1;
  /**
   * Token 名稱
   * 為首次約定付款(P₁)時，所使用之 TokenTerm 值
   */
  TokenTerm?: string;
  /**
   * Token 有效期限
   * 為首次約定付款(P₁)時，所使用之 TokenLife 值
   */
  TokenLife?: string;
};
