/**
 * 嵌入式信用卡支付頁 P1 首次交易請求參數
 *
 * 端點：
 * - 測試：https://c-inframe.newebpay.com/NWPJCore/PaymentC
 * - 正式：https://p-inframe.newebpay.com/NWPJCore/PaymentC
 *
 * Header:
 * - Authorization: Bearer {Prime}
 * - Content-Type: application/json
 *
 * @example
 * ```typescript
 * const params: EmbeddedPaymentParams = {
 *   Prime: "從前端 SDK 取得的 Prime 值",
 *   MerchantOrderNo: "Order_1234567890",
 *   Amt: 100,
 *   ProdDesc: "測試商品",
 *   PayerEmail: "test@example.com",
 *   CardHolderName: "Test User",
 *   // 若要啟用綁卡
 *   TokenSwitch: "get",
 *   TokenTerm: "user@example.com"
 * };
 * ```
 */
export type EmbeddedPaymentParams = {
  /**
   * 從前端 SDK (NewebPaySDK.getPrime) 取得的 Prime 值
   * Prime 有效時間為 15 秒
   */
  Prime: string;

  /**
   * 商店訂單編號
   * - 限英、數字、"_" 格式
   * - 長度限制為 30 字
   * - 同一商店中此編號不可重覆
   */
  MerchantOrderNo: string;

  /**
   * 訂單金額
   * - 純數字不含符號
   * - 幣別：新台幣
   */
  Amt: number;

  /**
   * 商品描述
   * - 編碼為 UTF-8 格式
   */
  ProdDesc: string;

  /**
   * 付款人(持卡人)電子信箱
   * - Email 格式需至少有 '@' 及 '.' 符號
   * - 此欄位資訊將會傳送給國際卡組織，作為交易驗證用
   */
  PayerEmail: string;

  /**
   * 持卡人姓名
   * - 持卡人於發卡銀行留存之英文姓名
   * - 英文格式，僅支援空格，半形逗點與 "-" 符號
   * - 長度限於 2-45 字元內
   * - 此欄位資訊將會傳送給國際卡組織，作為交易驗證用
   */
  CardHolderName: string;

  /**
   * 持卡人電話（選填）
   * - 持卡人於發卡銀行留存之電話
   * - 數字格式，長度限於 45 字元內
   */
  CardHolderPhone?: string;

  /**
   * 3D 交易（選填）
   * - "1" = 3D 交易
   * - 若為 3D 交易，請傳送 NotifyURL 及 ReturnURL
   * - 若未帶此參數則依商店的 3D 設定判斷
   */
  P3D?: "0" | "1";

  /**
   * 支付通知網址（選填）
   * - 僅支援 3D 交易及綁定信用卡
   * - 僅接受 80 與 443 Port
   */
  NotifyURL?: string;

  /**
   * 支付完成返回商店網址（選填）
   * - 僅支援 3D 交易及綁定信用卡
   * - 僅接受 80 與 443 Port
   */
  ReturnURL?: string;

  /**
   * 信用卡分期付款啟用（選填）
   * - 0 或無值 = 不開啟分期
   * - 3 = 分 3 期
   * - 6 = 分 6 期
   * - 12 = 分 12 期
   * - 18 = 分 18 期
   * - 24 = 分 24 期
   * - 30 = 分 30 期
   */
  Inst?: "" | "0" | "3" | "6" | "12" | "18" | "24" | "30";

  /**
   * Token 類別（選填）
   * - "get" = 啟用約定信用卡(TCC)功能
   * - 當此參數為 "get" 時，才會啟用約定信用卡功能
   */
  TokenSwitch?: "get" | "";

  /**
   * Token 名稱（當 TokenSwitch="get" 時必填）
   * - 為本 Token 的名稱
   * - 長度限制 20 字元
   */
  TokenTerm?: string;

  /**
   * Token 有效日期（選填）
   * - 格式為 yymm，例 1912=2019年12月
   * - 若為空值或設定日期大於信用卡到期日，則系統預設以信用卡到期日為主
   * - 當超過此 Token 有效日期時，則無法再以 TokenValue 進行後續約定付款(Pn)
   */
  TokenLife?: string;
};

