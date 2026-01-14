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
  /** 回應代碼 */
  RespondCode: string;
  /** 授權銀行 */
  AuthBank: string;
  /** 授權碼 */
  Auth: string;
  /** 授權日期 格式為 YYYYMMDD，例：20140304 */
  AuthDate: string;
  /** 授權時間 格式為 HHMMSS，例：123456 */
  AuthTime: string;
  /** 卡號前六碼 */
  Card6No: string;
  /** 卡號後四碼 */
  Card4No: string;
  /** 信用卡到期日，格式為 yymm */
  Exp: string;
  /** 付款人 IP */
  IP: string;
  /** 分期期數（選填） */
  Inst?: number;
  /** 首期金額（選填） */
  InstFirst?: number;
  /** 每期金額（選填） */
  InstEach?: number;
  /** 3D 驗證結果（選填） */
  ECI?: string;
  /** 支付方法（選填） */
  PaymentMethod?: string;
  /** 履約保證銀行 */
  EscrowBank: string;
  /** 檢核碼 */
  CheckCode: string;
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
