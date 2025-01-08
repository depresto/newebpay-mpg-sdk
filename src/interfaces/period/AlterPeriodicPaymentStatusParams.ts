export type AlterPeriodicPaymentStatusParams = {
  MerOrderNo: string;
  PeriodNo: string;
  AlterType: 'suspend' | 'terminate' | 'restart'
}
