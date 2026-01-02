/**
 * 查詢約定付款綁定狀態回應結果
 * 
 * @example
 * ```typescript
 * const result: QueryTokenStatusResponseResult = {
 *   MerchantID: "MS1234567",
 *   MerchantOrderNo: "2025011611000000",
 *   TokenValue: "abc123def456",
 *   TokenLife: "2026-01-16",
 *   TokenStatus: 1
 * };
 * ```
 */
export type QueryTokenStatusResponseResult = {
  /** 商店代號 */
  MerchantID: string;
  /** 商店訂單編號 */
  MerchantOrderNo: string;
  /** Token 值（選填） */
  TokenValue?: string;
  /** Token 有效期限（選填） */
  TokenLife?: string;
  /** Token 狀態：0=未使用, 1=已使用, 2=已停用, 9=已刪除（選填） */
  TokenStatus?: 0 | 1 | 2 | 9;
};

/**
 * 查詢約定付款綁定狀態回應
 * 
 * @example
 * ```typescript
 * const response: QueryTokenStatusResponse = {
 *   Status: "SUCCESS",
 *   Message: "查詢成功",
 *   Result: {
 *     MerchantID: "MS1234567",
 *     MerchantOrderNo: "2025011611000000",
 *     TokenValue: "abc123def456",
 *     TokenLife: "2026-01-16",
 *     TokenStatus: 1
 *   }
 * };
 * ```
 */
export type QueryTokenStatusResponse = {
  /** 狀態碼，"SUCCESS" 表示成功 */
  Status: "SUCCESS" | string;
  /** 回應訊息 */
  Message: string;
  /** 查詢結果 */
  Result: QueryTokenStatusResponseResult;
};

