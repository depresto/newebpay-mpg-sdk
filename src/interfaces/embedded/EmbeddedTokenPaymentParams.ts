/**
 * 嵌入式信用卡支付頁 Pn 後續約定付款請求參數
 *
 * 端點：
 * - 測試：https://c-inframe.newebpay.com/NWPJCore/PaymentTC
 * - 正式：https://p-inframe.newebpay.com/NWPJCore/PaymentTC
 *
 * Header:
 * - Authorization: Bearer {HashKey}
 * - Content-Type: application/json
 *
 * @example
 * ```typescript
 * const params: EmbeddedTokenPaymentParams = {
 *   TokenValue: "從 P1 回應取得的 TokenValue",
 *   TokenTerm: "user@example.com",
 *   MerchantOrderNo: "Order_1234567890",
 *   Amt: 100,
 *   ProdDesc: "測試商品"
 * };
 * ```
 */
export type EmbeddedTokenPaymentParams = {
    /**
     * 約定 Token
     * - 為首次約定付款(P1)成功時，所回傳之 TokenValue 值
     */
    TokenValue: string;
  
    /**
     * Token 名稱
     * - 為首次約定付款(P1)時，所使用之 TokenTerm 值
     */
    TokenTerm: string;
  
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
     * 付款人電子信箱（選填）
     * - Email 格式需至少有 '@' 及 '.' 符號
     */
    PayerEmail?: string;
  
    /**
     * 3D 交易（選填）
     * - "1" = 3D 交易
     * - 若為 3D 交易，請傳送 NotifyURL 及 ReturnURL
     * - 若未帶此參數則依商店的 3D 設定判斷
     */
    P3D?: "0" | "1";
  
    /**
     * 支付通知網址（選填）
     * - 僅支援 3D 交易
     * - 僅接受 80 與 443 Port
     */
    NotifyURL?: string;
  
    /**
     * 支付完成返回商店網址（選填）
     * - 僅支援 3D 交易
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
     * 紅利交易（選填）
     * - 1 = 啟用
     * - 0 或未帶此參數 = 不啟用
     */
    Red?: 0 | 1;
  };
  