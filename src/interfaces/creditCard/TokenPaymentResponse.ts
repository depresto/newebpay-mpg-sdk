/**
 * 後續約定付款回應結果
 * 
 * @example
 * ```typescript
 * const result: TokenPaymentResponseResult = {
 *   MerchantID: "MS1234567",
 *   Amt: 1000,
 *   TradeNo: "24011612345678901",
 *   MerchantOrderNo: "2025011613000000",
 *   PaymentType: "CREDIT",
 *   RespondType: "JSON",
 *   PayTime: "2025-01-16 12:34:56",
 *   IP: "192.168.1.1",
 *   EscrowBank: "ESUN",
 *   AuthBank: "ESUN",
 *   Card6No: "123456",
 *   Card4No: "7890",
 *   TokenUseStatus: 1
 * };
 * ```
 */
export type TokenPaymentResponseResult = {
  /** 商店代號 */
  MerchantID: string;
  /** 交易金額 */
  Amt: number;
  /** 藍新金流交易序號 */
  TradeNo: string;
  /** 商店訂單編號 */
  MerchantOrderNo: string;
  /** 支付方式 */
  PaymentType: string;
  /** 回應類型 */
  RespondType: string;
  /** 支付完成時間 */
  PayTime: string;
  /** 付款人 IP */
  IP: string;
  /** 履約保證銀行 */
  EscrowBank: string;
  /** 授權銀行（選填） */
  AuthBank?: string;
  /** 回應代碼（選填） */
  RespondCode?: string;
  /** 授權碼（選填） */
  Auth?: string;
  /** 卡號前六碼（選填） */
  Card6No?: string;
  /** 卡號後四碼（選填） */
  Card4No?: string;
  /** 分期期數（選填） */
  Inst?: number;
  /** 每期金額（選填） */
  InstEach?: number;
  /** 3D 驗證結果（選填） */
  ECI?: string;
  /** Token 使用狀態：0=未使用, 1=已使用, 2=已停用, 9=已刪除（選填） */
  TokenUseStatus?: 0 | 1 | 2 | 9;
  /** 紅利折抵金額（選填） */
  RedAmt?: number;
  /** 支付方法（選填） */
  PaymentMethod?: string;
};

/**
 * 後續約定付款回應
 * 
 * @example
 * ```typescript
 * const response: TokenPaymentResponse = {
 *   Status: "SUCCESS",
 *   Message: "交易成功",
 *   Result: {
 *     MerchantID: "MS1234567",
 *     Amt: 1000,
 *     TradeNo: "24011612345678901",
 *     MerchantOrderNo: "2025011613000000",
 *     PaymentType: "CREDIT",
 *     RespondType: "JSON",
 *     PayTime: "2025-01-16 12:34:56",
 *     IP: "192.168.1.1",
 *     EscrowBank: "ESUN",
 *     AuthBank: "ESUN"
 *   }
 * };
 * ```
 */
export type TokenPaymentResponse = {
  /** 狀態碼，"SUCCESS" 表示成功 */
  Status: "SUCCESS" | string;
  /** 回應訊息 */
  Message: string;
  /** 交易結果 */
  Result: TokenPaymentResponseResult;
};

