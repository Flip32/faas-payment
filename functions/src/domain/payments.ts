export type PaymentDataType = {
  amount: number
  customerInfo: {
    id: string
  }
  paymentToken: string
  companyId: string
  planId: string
  periodicity: string
}
