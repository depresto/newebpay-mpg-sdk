# Newebpay MPG SDK

藍新金流 幕前支付(MPG) SDK

## Installation

```bash
yarn add newebpay-mpg-sdk
```

## Usage

### Create SDK Instance (ES5)

```javascript
const NewebpayClient = require("newebpay-mpg-sdk");
const client = new NewebpayClient({
  merchantId: "Newebpay Merchant ID",
  hashKey: "Newebpay Hash Key",
  hashIV: "Newebpay Hash IV",
  env: "production", // 'sandbox' | 'production'
  version: "2.0", // Optional
});
```

### Create SDK Instance (ES6)

```javascript
import NewebpayClient from "newebpay-mpg-sdk";
const client = new NewebpayClient({
  merchantId: "Newebpay Merchant ID",
  hashKey: "Newebpay Hash Key",
  hashIV: "Newebpay Hash IV",
  env: "production", // 'sandbox' | 'production'
  version: "2.0", // Optional
});
```

### Get Payment Form

詳情請見官方文件：[文件網址](https://www.newebpay.com/website/Page/download_file?name=NewebPay_Online%20Payment-Foreground%20Scenario%20API%20Specification_NDNF-1.0.1.pdf)

```javascript
client.getPaymentFormHTML({
  MerchantOrderNo: "2020072812000000",  // 訂單編號 必填
  Amt: 1000,                            // 訂單金額 必填
  ItemDesc: '商品1,商品2',               // 商品資訊 必填 以逗號 (,) 分格, 最多 50 字元
  RespondType: 'JSON',                  // 回傳格式 非必填 'JSON' | 'String'
  TradeLimit: 900,                      // 交易限制秒數 非必填 60 - 900 秒
  ExpireDate: '20200729',               // 繳費有效期限 非必填 格式：YYYYMMDD
  ReturnURL: '',                        // 支付完成返回商店網址 非必填
  NotifyURL: '',                        // 支付通知網址 非必填
  CustomerURL: '',                      // 商店取號網址 非必填
  ClientBackURL: '',                    // 返回商店網址 非必填
  Email: 'test@example.com',            // 付款人電子信箱 非必填
  EmailModify: 1,                       // 付款人電子信箱是否開放修改 非必填 1 | 0
  OrderComment: '訂單訊息',              // 商店備註 非必填 最多 300 字元
  Version: '2.0',                       // 程式版本 非必填
  LangType: 'zh-tw',                    // 語系 非必填 'zh-tw' | 'en' | 'jp'
  LoginType: 0,                         // 是否登入藍新金流會員 非必填 1 | 0
  CREDIT: 1,                            // 信用卡一次付清啟用 非必填 1 | 0
  ANDROIDPAY: 0,                        // Google Pay 啟用 非必填 1 | 0
  SAMSUNGPAY: 0,                        // Samsung Pay 啟用 非必填 1 | 0
  LINEPAY: 0,                           // Line Pay 啟用 非必填 1 | 0
  ImageUrl: '',                         // Line Pay 產品圖檔連結網址 非必填
  InstFlag: '3,6',                      // 信用卡分期付款啟用 非必填 '3' | '6' | '12' | '18' | '24' | '30'
  CreditRed: 0,                         // 信用卡紅利啟用 非必填 1 | 0
  UNIONPAY: 0,                          // 信用卡銀聯卡啟用 非必填 1 | 0
  WEBATM: 0,                            // WEBATM 啟用 非必填 1 | 0
  VACC: 1,                              // ATM 轉帳啟用 非必填 1 | 0
  BankType: '',                         // 金融機構 非必填
  BARCODE: 0,                           // 超商條碼繳費啟用 非必填 1 | 0
  ESUNWALLET: 0,                        // 玉山 Wallet 啟用 非必填 1 | 0
  TAIWANPAY: 0,                         // 台灣 Pay 啟用 非必填 1 | 0
  CVSCOM: 0,                            // 物流啟用 非必填 1 | 0
  EZPAY: 0,                             // 簡單付電子錢包啟用 非必填 1 | 0
  EZPWECHAT: 0,                         // 簡單付微信支付啟用 非必填 1 | 0
  EZPALIPAY: 0,                         // 簡單付支付寶啟用 非必填 1 | 0
  LgsType: '',                          // 物流型態 非必填 'B2C' | 'C2C'
})
```

## Parse returning TradeInfo data

詳情請見官方文件：[文件網址](https://www.newebpay.com/website/Page/download_file?name=NewebPay_Online%20Payment-Foreground%20Scenario%20API%20Specification_NDNF-1.0.1.pdf)

```javascript
const rawTradeInfo = '' // TradeInfo data from api
const tradeInfo = client.parseTradeInfo(rawTradeInfo)
```
