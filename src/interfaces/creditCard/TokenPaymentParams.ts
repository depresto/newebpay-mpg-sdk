/**
 * 後續約定付款(Pₙ)幕後情境請求參數
 *
 * @example
 * ```typescript
 * const params: TokenPaymentParams = {
 *   MerchantOrderNo: "2025011613000000",
 *   Amt: 1000,
 *   TokenValue: "abc123def456",
 *   ProdDesc: "商品描述",
 *   PayerEmail: "customer@example.com",
 *   CardHolderName: "Test User",
 *   CardHolderPhone: "0912345678",
 *   NotifyURL: "https://example.com/notify",
 *   ReturnURL: "https://example.com/return"
 * };
 * ```
 */
export type TokenPaymentParams = {
  /** API 版本，預設為 "2.4" */
  Version?: "2.4";
  /** 商店訂單編號，需為唯一值 */
  MerchantOrderNo: string;
  /** 交易金額 */
  Amt: number;
  /** 約定付款 Token，由首次約定付款取得 */
  TokenValue: string;
  /**
   * Token 名稱
   * 為首次約定付款(P₁)時，所使用之 TokenTerm 值
   * 為後續約定付款(Pₙ)時，所使用之 TokenTerm 值
   */
  TokenTerm: string;
  /** 當此參數為 on 時，才會啟用約定信用卡(TCC)功能 */
  TokenSwitch: "on";
  /** 商品描述 */
  ProdDesc: string;
  /** 付款人 Email */
  PayerEmail: string;
  /**
   * 持卡人姓名（必填）
   * 持卡人於發卡銀行留存之英文姓名
   * 英文格式，僅支援空格，半形逗點與半形空白字元與"-"符號，長度限於 2-45 字元內
   **/
  CardHolderName: string;
  /** 持卡人電話（選填） */
  CardHolderPhone?: string;
  /** 支付完成後通知網址（選填） */
  NotifyURL?: string;
  /** 支付完成後返回網址（選填） */
  ReturnURL?: string;
};
