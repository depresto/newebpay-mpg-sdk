/**
 * 解除約定付款綁定請求參數
 *
 * @example
 * ```typescript
 * const params: UnbindTokenParams = {
 *   TokenTerm: "2026-01-16",
 *   TokenValue: "abc123def456"
 * };
 * ```
 */
export type UnbindTokenParams = {
  /**
   * 信用卡約定付款 Token 名稱
   * 為首次約定付款(P₁)時，所使用之 TokenTerm 值
   */
  TokenTerm: string;
  /** 信用卡約定付款 Token 值 */
  TokenValue: string;
};
