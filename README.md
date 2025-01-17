# Newebpay MPG SDK

藍新金流 幕前支付(MPG) SDK

## Installation

```bash
yarn add newebpay-mpg-sdk
```

## Usage

### Create SDK Instance (ES5)

```javascript
const NewebpayClient = require("newebpay-mpg-sdk").default;
const client = new NewebpayClient({
  merchantId: "Newebpay Merchant ID",
  partnerId: "Newebpay Partner ID (Partner API only)",
  hashKey: "Newebpay Hash Key",
  hashIV: "Newebpay Hash IV",
  env: "production", // 'sandbox' | 'production'
});
```

### Create SDK Instance (ES6)

```javascript
import NewebpayClient from "newebpay-mpg-sdk";
const client = new NewebpayClient({
  merchantId: "Newebpay Merchant ID",
  partnerId: "Newebpay Partner ID (Partner API only)",
  hashKey: "Newebpay Hash Key",
  hashIV: "Newebpay Hash IV",
  env: "production", // 'sandbox' | 'production'
});
```

### Get Payment Form (MPG 交易 [NPA-01])

詳情請見官方文件：[文件網址](https://www.newebpay.com/website/Page/download_file?name=NewebPay_Online%20Payment-Foreground%20Scenario%20API%20Specification_NDNF-1.0.1.pdf)

```javascript
client.getPaymentFormHTML({
  MerchantOrderNo: "2020072812000000", // 訂單編號 必填
  Amt: 1000, // 訂單金額 必填
  ItemDesc: "商品1,商品2", // 商品資訊 必填 以逗號 (,) 分格, 最多 50 字元
  RespondType: "JSON", // 回傳格式 非必填 'JSON' | 'String'
  TradeLimit: 900, // 交易限制秒數 非必填 60 - 900 秒
  ExpireDate: "20200729", // 繳費有效期限 非必填 格式：YYYYMMDD
  ReturnURL: "", // 支付完成返回商店網址 非必填
  NotifyURL: "", // 支付通知網址 非必填
  CustomerURL: "", // 商店取號網址 非必填
  ClientBackURL: "", // 返回商店網址 非必填
  Email: "test@example.com", // 付款人電子信箱 非必填
  EmailModify: 1, // 付款人電子信箱是否開放修改 非必填 1 | 0
  OrderComment: "訂單訊息", // 商店備註 非必填 最多 300 字元
  Version: "2.0", // 程式版本 非必填
  LangType: "zh-tw", // 語系 非必填 'zh-tw' | 'en' | 'jp'
  LoginType: 0, // 是否登入藍新金流會員 非必填 1 | 0
  CREDIT: 1, // 信用卡一次付清啟用 非必填 1 | 0
  APPLEPAY: 0, // Apple Pay 啟用 非必填 1 | 0
  ANDROIDPAY: 0, // Google Pay 啟用 非必填 1 | 0
  SAMSUNGPAY: 0, // Samsung Pay 啟用 非必填 1 | 0
  LINEPAY: 0, // Line Pay 啟用 非必填 1 | 0
  ImageUrl: "", // Line Pay 產品圖檔連結網址 非必填
  InstFlag: "3,6", // 信用卡分期付款啟用 非必填 '3' | '6' | '12' | '18' | '24' | '30'
  CreditRed: 0, // 信用卡紅利啟用 非必填 1 | 0
  UNIONPAY: 0, // 信用卡銀聯卡啟用 非必填 1 | 0
  WEBATM: 0, // WEBATM 啟用 非必填 1 | 0
  VACC: 1, // ATM 轉帳啟用 非必填 1 | 0
  BankType: "", // 金融機構 非必填
  BARCODE: 0, // 超商條碼繳費啟用 非必填 1 | 0
  ESUNWALLET: 0, // 玉山 Wallet 啟用 非必填 1 | 0
  TAIWANPAY: 0, // 台灣 Pay 啟用 非必填 1 | 0
  CVSCOM: 0, // 物流啟用 非必填 1 | 0
  EZPAY: 0, // 簡單付電子錢包啟用 非必填 1 | 0
  EZPWECHAT: 0, // 簡單付微信支付啟用 非必填 1 | 0
  EZPALIPAY: 0, // 簡單付支付寶啟用 非必填 1 | 0
  LgsType: "", // 物流型態 非必填 'B2C' | 'C2C'
});
```

### Parse returning TradeInfo data (解密 TradeInfo/AES256)

詳情請見官方文件：[文件網址](https://www.newebpay.com/website/Page/download_file?name=NewebPay_Online%20Payment-Foreground%20Scenario%20API%20Specification_NDNF-1.0.1.pdf)

```javascript
const rawTradeInfo = ""; // TradeInfo data from api
const tradeInfo = client.parseTradeInfo(rawTradeInfo);
```

### Generate Check Code for Verify Message (加密 CheckCode)

```javascript
const params = {
  // Some data from API
};
const checkCode = client.buildCheckCode(params);
```

### Refund an Credit Card Order (請退款/取消請退款 [NPA-B031~34])

詳情請見官方文件：[文件網址](https://www.newebpay.com/website/Page/download_file?name=NewebPay_Online%20Payment-Foreground%20Scenario%20API%20Specification_NDNF-1.0.1.pdf)

```javascript
const {
  Status, // 回傳狀態 若請退款成功則回傳 SUCCESS
  Message,
  Result: { MerchantID, Amt, TradeNo, MerchantOrderNo },
} = await client.refundCreditCardHTML({
  MerchantOrderNo: "2020072812000000", // 訂單編號 必填
  Amt: 1000, // 訂單金額 必填
  IndexType: 1, // 選用單號類別 必填 1 代表選用商店訂單編號 / 2 代表選用藍新金流交易序號
  TradeNo: "2020072812000000", // 藍新金流交易序號 必填
  CloseType: 1, // 請款或退款 必填 請款/取消請款時請填 1 / 退款/取消退款時請填 2
  Cancel: 1, // 取消請款或退款 非必填 配合 CloseType 欄位，欲發動取消請款或取消退款時此欄請填 1
});
```

### Cancel an Credit Card Order (取消授權 [NPA-B01])

詳情請見官方文件：[文件網址](https://www.newebpay.com/website/Page/download_file?name=Online%20Payment-Foreground%20Scenario%20API%20Specification_NDNF-1.0.7.pdf)

```javascript
const {
  Status, // 回傳狀態 若請退款成功則回傳 SUCCESS
  Message,
  Result: { MerchantID, Amt, TradeNo, MerchantOrderNo },
} = await client.cancelCreditCard({
  MerchantOrderNo: "2020072812000000", // 訂單編號 必填
  Amt: 1000, // 訂單金額 必填
  IndexType: 1, // 選用單號類別 必填 1 代表選用商店訂單編號 / 2 代表選用藍新金流交易序號
  TradeNo: "2020072812000000", // 藍新金流交易序號 必填
});
```

### Refund an EWallet Order (電子錢包退款 [NPA-B06])

詳情請見官方文件：[文件網址](https://www.newebpay.com/website/Page/download_file?name=NewebPay_Online%20Payment-Foreground%20Scenario%20API%20Specification_NDNF-1.0.1.pdf)

```javascript
const {
  UID, // 商店代號
  Status, // 回傳狀態 若退款成功則回傳 1000
  Message,
  Result: {
    // Parsed EncryptData_
    TradeNo,
    BankMessage,
    BankCode,
    MerchantOrderNo,
    RefundAmount,
    RefundDate,
  },
} = await client.refundCreditCardHTML({
  MerchantOrderNo: "2020072812000000", // 訂單編號 必填
  Amount: 1000, // 訂單金額 必填
  PaymentType: "LINEPAY", // 付款方式 必填
});

// 付款方式列表
// 玉山 Wallet = ESUNWALLET
// Line Pay = LINEPAY
// 台灣 Pay = TAIWANPAY
// ezPay waller = EZPAY
// Alipay = EZPALIPAY
// WeChat = EZPWECHAT
```

### Create Periodic Payment Form (定期定額 建立委託 [NPA-B05])

詳情請見官方文件：(信用卡定期定額技術串接手冊)：[文件網址](https://www.newebpay.com/website/Page/download_file?name=%E4%BF%A1%E7%94%A8%E5%8D%A1%E5%AE%9A%E6%9C%9F%E5%AE%9A%E9%A1%8D%E4%B8%B2%E6%8E%A5%E6%8A%80%E8%A1%93%E6%89%8B%E5%86%8A_NDNP-1.0.4.pdf)

```javascript
client.createPeriodicPaymentHTML({
  LangType: "zh-Tw", // 語系 非必填 'zh-Tw' | 'en' | 'jp'
  MerOrderNo: "2020072812000000", // 訂單編號 必填
  ProdDesc: "約定信用卡", // 委託商品或服務名稱 必填 僅限制使用中文、英文、數字、空格及底線，若內容必須含有特殊符號請自行轉為全形
  PeriodAmt: 10, // 委託金額 必填
  PeriodType: "M", // 週期類別 必填 D=固定天期 W=每週 M=每月 Y=每年
  PeriodPoint: "01", // 交易週期授權時間 必填 PeriodType = D，此欄位值限為數字 2~999 / PeriodType =W，此欄位值限為數字 1~7，代表每週一至週日 / 當 PeriodType = M，此欄位值限為數字 01~31，代表每月 1 號~31 號 / 當 PeriodType =Y，此欄位值格式為 MMDD
  PeriodStartType: 1, // 交易模式 必填 １=立即執行十元授權 / ２=立即執行委託金額授權 / ３=不檢查信用卡資訊，不授權
  PeriodTimes: 99, // 授權期數 必填 授權期數大於信用卡到期日，則系統自動以信用卡到期日為最終期數
  PeriodFirstdate: "2020/07/28", // 首期授權日 格式為『YYYY/mm/dd』
  PeriodMemo: "約定信用卡", // 備註說明 
  PayerEmail: "test@example.com", // 付款人電子信箱
  EmailModify: 0, // 付款人電子信箱是否開放修改 非必填 1 | 0 預設值為 1
  PaymentInfo: "N", // 是否開啟付款人資訊 Y | N 預設值為 Y
  OrderInfo: "N", // 是否開啟收件人資訊  Y | N 預設值為 Y
  ReturnURL: returnUrl, // 返回商店網址
  NotifyURL: notifyUrl, // 每期授權結果通知網址 
  BackURL: clientBackUrl, // 返回商店網址 
  UNIONPAY: 0, // 信用卡銀聯卡啟用 銀聯卡僅支援幕後非 3D 交易
});
```

### Parse returning Periodic Payment Result

詳情請見官方文件：(信用卡定期定額技術串接手冊) 4.3.2 回應參數-建立完成

```javascript
const rawResponse = ""; // 回應參數 請自行把 Period=xxxx 的參數取出
const { Status, Message, Result } = client.parsePeriodicPaymentResponse(rawResponse);
```

### Create a new merchant (Partner API)

詳情請見官方文件：(金流合作推廣商 商店建立技術串接手冊)

```javascript
const { status, message, result } = await client.addMerchant({
  // See Partner API (商店建立參數說明)
});
```

### Request Credit Card Backstage Purchase

信用卡幕後支付

詳情請見官方文件：(信用卡幕後授權技術串接手冊 標準版)

```javascript
const {
  Status,
  Message,
  Result: {
    MerchantID, // 藍新金流商店代號
    Amt, // 本次交易授權金額
    TradeNo, // 由藍新金流平台產生的系統交易序號
    MerchantOrderNo, // 商店自訂的訂單編號
    RespondCode, // 金融機構回應碼
    AuthBank, // 收單金融機構
    CheckCode, // 檢核碼
  },
} = await client.requestCreditCardPayment({
  P3D: 0, // 開啟3D交易 必填 1 | 0,
  NotifyURL: "https://...", // 支付通知網址 非必填 3D交易為必填參數
  ReturnURL: "https://...", // 支付完成返回商店網址 非必填 3D交易為必填參數
  MerchantOrderNo: "1234", // 商店訂單編號 必填 限英、數字、”_ ”格式 / 長度限制為30字
  Amt: 100, // 訂單金額 必填 純數字不含符號 / 新台幣
  ProdDesc: "商品", // 商品描述 必填 長度限制50字
  PayerEmail: "test@example.comm", // 付款人電子信箱 必填
  Inst: 0, // 信用卡分期付款 非必填 0或無值時，即代表不開啟分期，分為3/6/12/18/24/30期
  Red: 0, // 啟用紅利交易 非必填 1 | 0
  CardAE: 0, // 啟用美國運通卡 非必填 1 | 0
  CardNo: "4000221111111111", // 信用卡卡號 非必填 若非Google Pay或Apple Pay則為必填
  Exp: "234", // 信用卡到期日 非必填 若非Google Pay或Apple Pay則為必填
  CVC: "123", // 信用卡檢查碼 非必填 若非Google Pay或Apple Pay則為必填
  APPLEPAY: "", // Apple Pay payment token 非必填
  APPLEPAYTYPE: "", // Apple Pay 支付型態 非必填 01=In-app | 02=On-web
  ANDROIDPAY: "", // Google Pay payment token 非必填
  SAMSUNGPAY: "", // Samsung Pay payment token 非必填
  NTCB: 0, // 啟用國民旅遊卡 非必填 1 | 0
  NTCBArea: "", // 國民旅遊卡地區編號 非必填 詳見官方文件
  NTCBStart: "", // 國民旅遊卡起始日期 非必填 YYYY-MM-DD
  NTCBEnd: "", // 國民旅遊卡結束日期 非必填 YYYY-MM-DD
});
```

驗證回傳 CheckCode

```javascript
const clientCheckCode = client.buildCheckCode({
  Amt,
  MerchantID,
  MerchantOrderNo,
  TradeNo,
});
if (clientCheckCode === CheckCode) {
  console.log("CheckCode is valid");
}
```

### Request Credit Card Agreement Token: Front Stage

信用卡幕前首次約定付款

詳情請見官方文件：(約定信用卡付款授權技術串接手冊)

```javascript
// 回傳付款跳轉 HTML 表單
const tokenAgreementFormHTML = await client.getPaymentFormHTML({
  NotifyURL: "https://...", // 支付通知網址 必填
  ReturnURL: "https://...", // 支付完成返回商店網址 必填
  MerchantOrderNo: "1234", // 商店訂單編號 必填 限英、數字、”_ ”格式 / 長度限制為30字
  Amt: 100, // 訂單金額 必填 純數字不含符號 / 新台幣
  ItemDesc: "約定信用卡", // 商品資訊 必填 以逗號 (,) 分格, 最多50字元
  OrderComment: "約定信用卡", // 商店備註 非必填 最多300字元
  Email: "test@example.comm", // 付款人電子信箱 必填
  TokenTerm: "User ID", // Token名稱 必填 可對應付款人之資料，用於綁定付款人與信用卡卡號時使用，例:會員編號、Email
  TokenLife: "2401", // Token有效日期 非必填 格式為YYMM，如2024/01為2401
  CREDITAGREEMENT: 1, // 約定信用卡付款 必填 1
  ANDROIDPAYAGREEMENT: 0, // 約定Google Pay付款 非必填 0 | 1
  SAMSUNGPAYAGREEMENT: 0, // 約定Samsung Pay付款 非必填 0 | 1
});
```

### Request Credit Card Agreement Token: Backstage

信用卡幕後首次約定付款

詳情請見官方文件：(信用卡幕後授權技術串接手冊 標準版)

```javascript
const {
  Status,
  Message,
  Result: {
    MerchantID, // 藍新金流商店代號
    Amt, // 本次交易授權金額
    TradeNo, // 由藍新金流平台產生的系統交易序號
    MerchantOrderNo, // 商店自訂的訂單編號
    RespondCode, // 金融機構回應碼
    AuthBank, // 收單金融機構
    CheckCode, // 檢核碼
    TokenValue, // 約定 Token
    TokenLife, // Token 有效日期
  },
} = await client.requestCreditCardPayment({
  P3D: 1, // 開啟3D交易 必填 1 | 0,
  NotifyURL: "https://...", // 支付通知網址 非必填 3D交易為必填參數
  ReturnURL: "https://...", // 支付完成返回商店網址 非必填 3D交易為必填參數
  MerchantOrderNo: "1234", // 商店訂單編號 必填 限英、數字、”_ ”格式 / 長度限制為30字
  Amt: 100, // 訂單金額 必填 純數字不含符號 / 新台幣
  ProdDesc: "約定信用卡", // 商品描述 必填 長度限制50字
  PayerEmail: "test@example.comm", // 付款人電子信箱 必填
  Inst: 0, // 信用卡分期付款 非必填 0或無值時，即代表不開啟分期，分為3/6/12/18/24/30期
  CardNo: "4000221111111111", // 信用卡卡號 必填
  Exp: "234", // 信用卡到期日 必填
  CVC: "123", // 信用卡檢查碼 必填
  TokenSwitch: "get", // Token類別 必填 固定為get
  TokenTerm: "User ID", // Token名稱 必填 可對應付款人之資料，用於綁定付款人與信用卡卡號時使用，例:會員編號、Email
  TokenLife: "2401", // Token有效日期 非必填 格式為YYMM，如2024/01為2401
});
```

### Request Credit Card Payment by Token: Backstage

信用卡幕後後續約定付款

詳情請見官方文件：(信用卡幕後授權技術串接手冊 標準版)

```javascript
const {
  Status,
  Message,
  Result: {
    MerchantID, // 藍新金流商店代號
    Amt, // 本次交易授權金額
    TradeNo, // 由藍新金流平台產生的系統交易序號
    MerchantOrderNo, // 商店自訂的訂單編號
    RespondCode, // 金融機構回應碼
    AuthBank, // 收單金融機構
    CheckCode, // 檢核碼
    TokenValue, // 約定 Token
    TokenLife, // Token 有效日期
  },
} = await client.requestCreditCardPayment({
  P3D: 0, // 開啟3D交易 必填 1 | 0,
  NotifyURL: "https://...", // 支付通知網址 非必填 3D交易為必填參數
  ReturnURL: "https://...", // 支付完成返回商店網址 非必填 3D交易為必填參數
  MerchantOrderNo: "1234", // 商店訂單編號 必填 限英、數字、”_ ”格式 / 長度限制為30字
  Amt: 100, // 訂單金額 必填 純數字不含符號 / 新台幣
  ProdDesc: "約定信用卡", // 商品描述 必填 長度限制50字
  PayerEmail: "test@example.comm", // 付款人電子信箱 必填
  Inst: 0, // 信用卡分期付款 非必填 0或無值時，即代表不開啟分期，分為3/6/12/18/24/30期
  CardNo: "4000221111111111", // 信用卡卡號 必填
  Exp: "234", // 信用卡到期日 必填
  CVC: "123", // 信用卡檢查碼 必填
  TokenSwitch: "on", // Token類別 必填 固定為on
  TokenTerm: "User ID", // Token名稱 必填 可對應付款人之資料，用於綁定付款人與信用卡卡號時使用，例:會員編號、Email
  TokenLife: "2401", // Token有效日期 非必填 格式為YYMM，如2024/01為2401
  TokenValue: "", // 首次約定付款回傳之TokenValue 必填
});
```

### Charge a Partner store

平台費用扣款

詳情請見官方文件：(金流合作推廣商平台 費用扣款指示 技術串接手冊)

```javascript
const {
  Status,
  Message,
  MerchantID, // 藍新金流商店代號
  FundTime, // 預計撥款日
  MerTrade, // 自訂編號
  ExeNo, // 處理流水號
} = await client.chargeMerchant({
  MerchantID: "商店代號",
  MerTrade: "自訂編號",
  Amount: 100,
  FeeType: "1", // 0:平台交易手續費 1:佣金費用 2:退款費用 3:物流費用 4:其他費用
  BalanceType: "0", // 本次交易的正負值 0為正向，1為負向
  AppointMerID: "收款商店代號", // 選填，若需將扣款合作商店金額寫入指定商 店餘額請帶此參數
});
```
