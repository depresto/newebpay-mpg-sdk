export type AlterPeriodicPaymentAmountParams = {
  MerOrderNo: string;
  PeriodNo: string;
  AlterAmt?: number
  PeriodType?: 'D' | 'W' | 'M' | 'Y'
  PeriodPoint?: string
  PeriodTimes?: number
  Extday?: string
  NotifyURL?: string
}
