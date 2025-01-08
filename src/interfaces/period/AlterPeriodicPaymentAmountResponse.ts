export type AlterPeriodicPaymentAmountResponseResult = {
  MerOrderNo: string
  PeriodNo: string
  AlterAmt: number
  PeriodType: 'D' | 'W' | 'M' | 'Y'
  PeriodPoint: string
  NewNextAmt: number
  NewNextTime: string
  PeriodTimes: string
  Extday: string
  NotifyURL: string
}

export type AlterPeriodicPaymentAmountResponse ={ 
  Status: 'SUCCESS' | 'string'
  Message: string
  Result: AlterPeriodicPaymentAmountResponseResult | null
}