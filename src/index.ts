import { AddMerchantParams } from "./interfaces/merchant/AddMerchantParams";
import { ModifyMerchantParams } from "./interfaces/merchant/ModifyMerchantParams";
import { ChargeMerchantParams } from "./interfaces/merchant/ChargeMerchantParams";
import { ChargeMerchantResult } from "./interfaces/merchant/ChargeMerchantResult";
import { CancelCreditCardParams } from "./interfaces/creditCard/CancelCreditCardParams";
import { CreditCardAgreementTokenParams } from "./interfaces/creditCard/CreditCardAgreementTokenParams";
import { CreditCardPaymentParams } from "./interfaces/creditCard/CreditCardPaymentParams";
import { RefundCreditCardParams } from "./interfaces/creditCard/RefundCreditCardParams";
import { GetPaymentFormHTMLParams } from "./interfaces/mpg/GetPaymentFormHTMLParams";
import { QueryTradeInfoParams } from "./interfaces/QueryTradeInfoParams";
import { RefundEWalletParams } from "./interfaces/RefundEWalletParams";
import { TradeInfo } from "./interfaces/TradeInfo";
import { TradeInfoResult } from "./interfaces/TradeInfoResult";
import { CreatePeriodicPaymentParams } from "./interfaces/period/CreatePeriodicPaymentParams";
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
  CreatePeriodicPaymentParams,
  AddMerchantParams,
  ChargeMerchantParams,
  ChargeMerchantResult,
  ModifyMerchantParams,
};

export default NewebpayClient;
