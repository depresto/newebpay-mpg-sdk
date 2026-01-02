/**
 * 解除約定付款綁定回應結果
 * 
 * @example
 * ```typescript
 * const result: UnbindTokenResponseResult = {
 *   MerchantID: "MS1234567",
 *   MerchantOrderNo: "2025011611000000"
 * };
 * ```
 */
export type UnbindTokenResponseResult = {
  /** 商店代號 */
  MerchantID: string;
  /** 商店訂單編號 */
  MerchantOrderNo: string;
};

/**
 * 解除約定付款綁定回應
 * 
 * @example
 * ```typescript
 * const response: UnbindTokenResponse = {
 *   Status: "SUCCESS",
 *   Message: "解除綁定成功",
 *   Result: {
 *     MerchantID: "MS1234567",
 *     MerchantOrderNo: "2025011611000000"
 *   }
 * };
 * ```
 */
export type UnbindTokenResponse = {
  /** 狀態碼，"SUCCESS" 表示成功 */
  Status: "SUCCESS" | string;
  /** 回應訊息 */
  Message: string;
  /** 解除綁定結果 */
  Result: UnbindTokenResponseResult;
};

