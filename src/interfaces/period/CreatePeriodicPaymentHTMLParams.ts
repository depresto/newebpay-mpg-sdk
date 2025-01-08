export type CreatePeriodicPaymentHTMLParams = {
  LangType?: 'zh-Tw' |'en'
  MerOrderNo: string
  ProdDesc: string
  PeriodAmt: number
  PeriodType: 'D' | 'W' | 'M' | 'Y'
  PeriodPoint: string
  PeriodStartType: 1 | 2 | 3
  PeriodTimes: number
  PeriodFirstdate?: string
  PeriodMemo?: string
  PayerEmail: string
  EmailModify?: 0 | 1
  PaymentInfo?: 'Y' | 'N'
  OrderInfo?: 'Y' | 'N'
  ReturnURL?: string
  NotifyURL?: string
  BackURL?: string
  UNIONPAY?: 0 | 1
}