/**
 * 查詢約定付款綁定狀態請求參數
 *
 * @example
 * ```typescript
 * const params: QueryTokenStatusParams = {
 *   TokenTerm: "2026-01-16",
 *   TokenValue: "abc123def456"
 * };
 * ```
 */
export type QueryTokenStatusParams = {
  /**
   * 信用卡約定付款 Token 名稱
   * 為首次約定付款(P₁)時，所使用之 TokenTerm 值
   * 為後續約定付款(Pₙ)時，所使用之 TokenTerm 值
   */
  TokenTerm: string;
  /** 信用卡約定付款 Token 值 */
  TokenValue: string;
};
