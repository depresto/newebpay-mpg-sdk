import { AddMerchantParams } from "./interfaces/AddMerchantParams";
import { CancelCreditCardParams } from "./interfaces/CancelCreditCardParams";
import { ChargeMerchantParams } from "./interfaces/ChargeMerchantParams";
import { ChargeMerchantResult } from "./interfaces/ChargeMerchantResult";
import { CreditCardAgreementTokenParams } from "./interfaces/CreditCardAgreementTokenParams";
import { CreditCardPaymentParams } from "./interfaces/CreditCardPaymentParams";
import { GetPaymentFormHTMLParams } from "./interfaces/GetPaymentFormHTMLParams";
import { ModifyMerchantParams } from "./interfaces/ModifyMerchantParams";
import { QueryTradeInfoParams } from "./interfaces/QueryTradeInfoParams";
import { RefundCreditCardParams } from "./interfaces/RefundCreditCardParams";
import { RefundEWalletParams } from "./interfaces/RefundEWalletParams";
import { TradeInfo } from "./interfaces/TradeInfo";
import { TradeInfoResult } from "./interfaces/TradeInfoResult";
import { NewebpayClient } from "./newebpay.client";

export {
  NewebpayClient,
  TradeInfoResult,
  TradeInfo,
  GetPaymentFormHTMLParams,
  QueryTradeInfoParams,
  RefundCreditCardParams,
  CancelCreditCardParams,
  RefundEWalletParams,
  CreditCardAgreementTokenParams,
  CreditCardPaymentParams,
  AddMerchantParams,
  ChargeMerchantParams,
  ChargeMerchantResult,
  ModifyMerchantParams,
};

export default NewebpayClient;
