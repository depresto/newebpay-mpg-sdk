export type AlterPeriodicPaymentStatusResponseResult = {
  MerOrderNo: string;
  PeriodNo: string;
  AlterType: string;
  NewNextTime: string;
};

export type AlterPeriodicPaymentStatusResponse = {
  Status: "SUCCESS" | "string";
  Message: string;
  Result: AlterPeriodicPaymentStatusResponseResult | null;
};
