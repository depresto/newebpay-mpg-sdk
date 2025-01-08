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
import { CreatePeriodicPaymentHTMLParams } from "./interfaces/period/CreatePeriodicPaymentHTMLParams";
import { NewebpayClient } from "./newebpay.client";
import { CreatePeriodicPaymentResponse, CreatePeriodicPaymentResult } from "./interfaces/period/CreatePeriodicPaymentResult";
import { PeriodicPaymentResponse } from "./interfaces/period/PeriodicPaymentResponse";
import { AlterPeriodicPaymentStatusParams } from "./interfaces/period/AlterPeriodicPaymentStatusParams";
import { AlterPeriodicPaymentStatusResponse } from "./interfaces/period/AlterPeriodicPaymentStatusResponse";
import { AlterPeriodicPaymentAmountResponse } from "./interfaces/period/AlterPeriodicPaymentAmountResponse";
import { AlterPeriodicPaymentAmountParams } from "./interfaces/period/AlterPeriodicPaymentAmountParams";

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
  CreatePeriodicPaymentHTMLParams,
  CreatePeriodicPaymentResponse,
  CreatePeriodicPaymentResult,
  AddMerchantParams,
  ChargeMerchantParams,
  ChargeMerchantResult,
  ModifyMerchantParams,
  PeriodicPaymentResponse,
  AlterPeriodicPaymentStatusParams,
  AlterPeriodicPaymentStatusResponse,
  AlterPeriodicPaymentAmountParams,
  AlterPeriodicPaymentAmountResponse,
  
};

export default NewebpayClient;
