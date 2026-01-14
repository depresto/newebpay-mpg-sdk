/**
 * 嵌入式信用卡支付頁回應結果
 *
 * P1 首次交易與 Pn 後續約定付款共用此回應結構
 */
export type EmbeddedPaymentResult = {
  /** 商店代號 */
  MerchantID: string;

  /** 交易金額 */
  Amt: number;

  /** 藍新金流交易序號 */
  TradeNo: string;

  /** 商店訂單編號 */
  MerchantOrderNo: string;

  /**
   * 金融機構回應碼
   * - "00" 表示成功
   */
  RespondCode: string;

  /**
   * 收單金融機構
   * - Esun: 玉山銀行
   * - Taishin: 台新銀行
   * - CTBC: 中國信託銀行
   * - NCCC: 聯合信用卡中心
   * - CathayBK: 國泰世華銀行
   * - Citibank: 花旗銀行
   * - UBOT: 聯邦銀行
   * - SKBank: 新光銀行
   * - Fubon: 富邦銀行
   * - FirstBank: 第一銀行
   * - LINEBank: 連線商業銀行
   */
  AuthBank: string;

  /**
   * 授權碼
   * - 若交易送至收單機構授權時已是失敗狀態，則為空值
   */
  Auth?: string;

  /** 授權日期，格式為 yyyymmdd */
  AuthDate: string;

  /** 授權時間，格式為 hhmmss */
  AuthTime: string;

  /**
   * 卡號前六碼
   * - 有開啟前8後2功能者則為前8碼
   */
  Card6No: string;

  /**
   * 卡號後四碼
   * - 有開啟前8後2功能者則為後2碼
   */
  Card4No: string;

  /** 信用卡到期日，格式為 yymm */
  Exp: string;

  /** 分期-期別 */
  Inst?: number;

  /** 分期-首期金額 */
  InstFirst?: number;

  /** 分期-每期金額 */
  InstEach?: number;

  /**
   * ECI 值
   * - 3D 回傳值 eci=1,2,5,6，代表為 3D 交易
   * - 若非 3D 交易或交易失敗則為空值
   */
  ECI?: string;

  /**
   * 交易類別
   * - CREDIT: 台灣發卡機構核發之信用卡
   * - FOREIGN: 國外發卡機構核發之信用卡
   */
  PaymentMethod: "CREDIT" | "FOREIGN";

  /** 付款人交易時的 IP */
  IP: string;

  /**
   * 款項保管銀行
   * - HNCB: 華南銀行
   * - 如商店是直接與銀行簽約的信用卡特約商店則為空值
   */
  EscrowBank?: string;

  /**
   * 檢核碼
   * - 用來檢查此次資料回傳的合法性
   * - 可使用 buildCheckCode 方法驗證
   */
  CheckCode: string;

  /**
   * 約定 Token（P1 綁卡時回傳）
   * - 發動 API 時有傳送 TokenTerm 且授權成功才會回傳
   * - 提供商店於後續約定付款 Pn 時使用
   */
  TokenValue?: string;

  /**
   * Token 有效日期（P1 綁卡時回傳）
   * - 格式為 yyyy-mm-dd
   * - 當超過此日期時，則無法再以 TokenValue 進行後續約定付款
   */
  TokenLife?: string;

  /**
   * 信用卡快速結帳使用狀態
   * - 0: 該筆交易為非使用信用卡快速結帳功能
   * - 1: 該筆交易為首次設定信用卡快速結帳功能
   * - 2: 該筆交易為使用信用卡快速結帳功能
   */
  TokenUseStatus?: 0 | 1 | 2;

  /**
   * 紅利折抵後實際金額（Pn 紅利交易時回傳）
   * - 扣除紅利交易折抵後的實際授權金額
   */
  RedAmt?: number;
};

/**
 * 3D 驗證回應
 * 當 P3D=1 時，API 回傳 3D 驗證 HTML
 */
export type Embedded3DResponse = {
  Status: "SUCCESS";
  /** 通常為 "成功取得 3D HTML" 或類似訊息 */
  Message: string;
  /** URL encoded HTML 字串，需使用 decodeURIComponent 解碼後執行 */
  Result: string;
};

/**
 * 一般交易成功回應
 */
export type EmbeddedSuccessResponse = {
  Status: "SUCCESS";
  Message: string;
  Result: EmbeddedPaymentResult;
};

/**
 * 嵌入式信用卡支付頁回應
 *
 * @example
 * ```typescript
 * // 成功回應
 * const response: EmbeddedPaymentResponse = {
 *   Status: "SUCCESS",
 *   Message: "授權成功",
 *   Result: {
 *     MerchantID: "MS123456",
 *     Amt: 100,
 *     TradeNo: "24071714322191423",
 *     // ...
 *   }
 * };
 *
 * // 3D 交易回應（Result 為 HTML 字串）
 * const response3D: EmbeddedPaymentResponse = {
 *   Status: "SUCCESS",
 *   Message: "成功取得 3D HTML",
 *   Result: "%3Cform+name%3D%27spgateway%27..." // URL encoded HTML
 * };
 * ```
 */
export type EmbeddedPaymentResponse = {
  /**
   * 回傳狀態
   * - "SUCCESS" 表示成功
   * - 其他為錯誤代碼
   */
  Status: "SUCCESS" | string;

  /** 回傳訊息 */
  Message: string;

  /**
   * 回傳資料
   * - 非 3D 交易：EmbeddedPaymentResult 物件
   * - 3D 交易（P3D=1）：URL encoded HTML 字串，需解碼後執行
   */
  Result: EmbeddedPaymentResult | string;
};

/**
 * 判斷回應是否為 3D 驗證回應
 *
 * @example
 * ```typescript
 * const response = await client.embeddedCreditCardPayment({ P3D: "1", ... });
 * if (is3DResponse(response)) {
 *   const html = decodeURIComponent(response.Result);
 *   // 將 HTML 注入頁面執行 3D 驗證
 * }
 * ```
 */
export function is3DResponse(
  response: EmbeddedPaymentResponse
): response is Embedded3DResponse {
  return (
    response.Status === "SUCCESS" &&
    typeof response.Result === "string" &&
    response.Result.includes("%3C") // URL encoded '<'
  );
}

/**
 * 判斷回應是否為一般成功回應（非 3D）
 */
export function isSuccessResponse(
  response: EmbeddedPaymentResponse
): response is EmbeddedSuccessResponse {
  return (
    response.Status === "SUCCESS" &&
    typeof response.Result === "object" &&
    response.Result !== null
  );
}

