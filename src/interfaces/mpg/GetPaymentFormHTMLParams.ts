/**
 * 產生 MPG 支付表單 HTML 的參數
 * 支援一般支付與約定付款（首次約定付款 P₁ 幕前情境）
 *
 * @example
 * 一般支付範例：
 * ```typescript
 * const params: GetPaymentFormHTMLParams = {
 *   MerchantOrderNo: "2025011611000000",
 *   Amt: 1000,
 *   ItemDesc: "商品描述",
 *   Email: "customer@example.com",
 *   ReturnURL: "https://example.com/return",
 *   NotifyURL: "https://example.com/notify",
 *   CREDIT: 1,
 *   WEBATM: 1,
 *   CVS: 1
 * };
 * ```
 *
 * @example
 * 約定付款範例：
 * ```typescript
 * const params: GetPaymentFormHTMLParams = {
 *   Version: "2.4",
 *   MerchantOrderNo: "2025011611000000",
 *   Amt: 1000,
 *   ItemDesc: "商品描述",
 *   Email: "customer@example.com",
 *   ReturnURL: "https://example.com/return",
 *   NotifyURL: "https://example.com/notify",
 *   CREDIT: 1,
 *   CREDITAGREEMENT: 1,
 *   TokenTerm: "2026-01-16",
 *   TokenLife: "2026-01-16",
 *   UseFor: "訂閱服務",
 *   MobileVerify: 1,
 *   MobileNumber: "0912345678"
 * };
 * ```
 */
export type GetPaymentFormHTMLParams = {
  /** API 版本，約定付款時預設為 "2.4"，一般支付預設為 "2.0" */
  Version?: string;
  /** 語系：zh-tw（繁體中文）、en（英文）、jp（日文），預設為 "zh-tw" */
  LangType?: "zh-tw" | "en" | "jp";
  /** 商店訂單編號，需為唯一值 */
  MerchantOrderNo: string;
  /** 交易金額 */
  Amt: number;
  /** 商品描述 */
  ItemDesc: string;
  /** 交易限制秒數（選填） */
  TradeLimit?: number;
  /** 繳費有效期限，格式：YYYYMMDD（選填） */
  ExpireDate?: string;
  /** 支付完成後返回網址（選填） */
  ReturnURL?: string;
  /** 支付完成後通知網址（選填） */
  NotifyURL?: string;
  /** 商店取號網址（選填） */
  CustomerURL?: string;
  /** 返回商店的網址（選填） */
  ClientBackURL?: string;
  /** 付款人 Email（選填） */
  Email?: string;
  /** Email 是否允許修改：0=不可修改, 1=可修改（選填） */
  EmailModify?: 0 | 1;
  /** 是否需要登入藍新金流會員：0=不需要, 1=需要（選填） */
  LoginType?: 0 | 1;
  /** 備註（選填） */
  OrderComment?: string;
  /** 是否啟用信用卡支付：0=不啟用, 1=啟用（選填） */
  CREDIT?: 0 | 1;
  /** 是否啟用美國運通卡：0=不啟用, 1=啟用（選填） */
  CREDITAE?: 0 | 1;
  /** 是否啟用 Apple Pay：0=不啟用, 1=啟用（選填） */
  APPLEPAY?: 0 | 1;
  /** 是否啟用 Android Pay：0=不啟用, 1=啟用（選填） */
  ANDROIDPAY?: 0 | 1;
  /** 是否啟用 Samsung Pay：0=不啟用, 1=啟用（選填） */
  SAMSUNGPAY?: 0 | 1;
  /** 是否啟用 LINE Pay：0=不啟用, 1=啟用（選填） */
  LINEPAY?: 0 | 1;
  /** 商店圖示網址（選填） */
  ImageUrl?: string;
  /** 信用卡分期付款期數，例如 "3" 表示 3 期（選填） */
  InstFlag?: "1" | string;
  /** 是否啟用紅利折抵：0=不啟用, 1=啟用（選填） */
  CreditRed?: 0 | 1;
  /** 是否啟用銀聯卡：0=不啟用, 1=啟用（選填） */
  UNIONPAY?: 0 | 1;
  /** 是否啟用網路 ATM：0=不啟用, 1=啟用（選填） */
  WEBATM?: 0 | 1;
  /** 是否啟用虛擬帳號：0=不啟用, 1=啟用（選填） */
  VACC?: 0 | 1;
  /** 虛擬帳號銀行代碼（選填） */
  BankType?: string;
  /** 是否啟用超商代碼：0=不啟用, 1=啟用（選填） */
  CVS?: 0 | 1;
  /** 是否啟用超商條碼：0=不啟用, 1=啟用（選填） */
  BARCODE?: 0 | 1;
  /** 是否啟用玉山 Wallet：0=不啟用, 1=啟用（選填） */
  ESUNWALLET?: 0 | 1;
  /** 是否啟用台灣 Pay：0=不啟用, 1=啟用（選填） */
  TAIWANPAY?: 0 | 1;
  /** 是否啟用超商取貨付款：0=不啟用, 1=啟用（選填） */
  CVSCOM?: 0 | 1;
  /** 是否啟用簡單付：0=不啟用, 1=啟用（選填） */
  EZPAY?: 0 | 1;
  /** 是否啟用簡單付微信：0=不啟用, 1=啟用（選填） */
  EZPWECHAT?: 0 | 1;
  /** 是否啟用簡單付支付寶：0=不啟用, 1=啟用（選填） */
  EZPALIPAY?: 0 | 1;
  /** 物流類型：B2C（店到店）、C2C（店到宅）（選填） */
  LgsType?: "B2C" | "C2C";

  // 約定付款相關參數
  /** 是否啟用約定信用卡付款：1=啟用（選填） */
  CREDITAGREEMENT?: 1;
  /** 是否啟用約定 Android Pay：1=啟用（選填） */
  ANDROIDPAYAGREEMENT?: 1;
  /** 是否啟用約定 Samsung Pay：1=啟用（選填） */
  SAMSUNGPAYAGREEMENT?: 1;
  /**
   * Token 名稱
   * 為首次約定付款(P₁)時，所使用之 TokenTerm 值
   */
  TokenTerm?: string;
  /** Token 生命週期，格式：YYYYMMDD（選填） */
  TokenLife?: string;
  /** Token 到期提醒設定（選填） */
  TokenTermDemand?: string;
  /**
   * 約定付款用途（選填，預設為 0)
   * 0: Web
   * 1: App
   * 2: 定期定額
   * 當使用 1 或 2 情境時, 首次約定付款皆須進行 3D 交易
   */
  UseFor?: "0" | "1" | "2";
  /**
   * 手機驗證開關：0=關閉, 1=開啟（選填），預設為 0
   * 商家使用 APP 進行約定信用卡交易即 UseFor=1 時, 以何種方式進行驗證：
   * 0=綁卡後前三筆交易進行 3D 驗證
   * 1=手機電話驗證
   * 2=手機電話驗證(驗證失敗時會轉為綁卡後前三筆交易進行 3D 驗證)
   */
  MobileVerify?: 0 | 1;
  /** 手機號碼（選填） */
  MobileNumber?: string;
  /** 手機號碼是否允許修改：0=不可修改, 1=可修改（選填） */
  MobileNumberModify?: 0 | 1;
};
