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

### Get Payment Form

詳情請見官方文件：[文件網址](https://www.newebpay.com/website/Page/download_file?name=NewebPay_Online%20Payment-Foreground%20Scenario%20API%20Specification_NDNF-1.0.1.pdf)

```javascript
client.getPaymentFormHTML({
  Version: "2.0", // API 版本 非必填 預設 2.0
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

### Parse returning TradeInfo data

詳情請見官方文件：[文件網址](https://www.newebpay.com/website/Page/download_file?name=NewebPay_Online%20Payment-Foreground%20Scenario%20API%20Specification_NDNF-1.0.1.pdf)

```javascript
const rawTradeInfo = ""; // TradeInfo data from api
const tradeInfo = client.parseTradeInfo(rawTradeInfo);
```

### Generate Check Code for Verify Message

```javascript
const params = {
  // Some data from API
};
const checkCode = client.buildCheckCode(params);
```

### Refund an Credit Card Order

詳情請見官方文件：[文件網址](https://www.newebpay.com/website/Page/download_file?name=NewebPay_Online%20Payment-Foreground%20Scenario%20API%20Specification_NDNF-1.0.1.pdf)

```javascript
const { 
  Status, // 回傳狀態 若請退款成功則回傳 SUCCESS
  Message, 
  Result: { MerchantID, Amt, TradeNo, MerchantOrderNo }
} = await client.refundCreditCardHTML({
  MerchantOrderNo: "2020072812000000", // 訂單編號 必填
  Amt: 1000, // 訂單金額 必填
  IndexType: 1, // 選用單號類別 必填 1 代表選用商店訂單編號 / 2 代表選用藍新金流交易序號
  TradeNo: "2020072812000000", // 藍新金流交易序號 必填
  CloseType: 1, // 請款或退款 必填 請款/取消請款時請填 1 / 退款/取消退款時請填 2
  Cancel: 1, // 取消請款或退款 非必填 配合 CloseType 欄位，欲發動取消請款或取消退款時此欄請填 1
});
```

### Refund an EWallet Order

詳情請見官方文件：[文件網址](https://www.newebpay.com/website/Page/download_file?name=NewebPay_Online%20Payment-Foreground%20Scenario%20API%20Specification_NDNF-1.0.1.pdf)

```javascript
const { 
  UID, // 商店代號
  Status, // 回傳狀態 若退款成功則回傳 1000
  Message, 
  Result: { // Parsed EncryptData_
    TradeNo, 
    BankMessage, 
    BankCode, 
    MerchantOrderNo, 
    RefundAmount, 
    RefundDate
  }
} = await client.refundCreditCardHTML({
  MerchantOrderNo: "2020072812000000", // 訂單編號 必填
  Amount: 1000, // 訂單金額 必填
  PaymentType: "LINEPAY" // 付款方式 必填 
});

// 付款方式列表
// 玉山 Wallet = ESUNWALLET
// Line Pay = LINEPAY
// 台灣 Pay = TAIWANPAY
// ezPay waller = EZPAY
// Alipay = EZPALIPAY
// WeChat = EZPWECHAT
```

### Create a new merchant (Partner API)

詳情請見官方文件：(金流合作推廣商 商店建立技術串接手冊)

```javascript
const { status, message, result } = await client.addMerchant({
  // See Partner API (商店建立參數說明)
})
```
