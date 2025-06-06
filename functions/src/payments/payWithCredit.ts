import axios from 'axios'
import { getIdempotencyKey } from '../utils/idempotency'

export const payWithCredit = async (data: any, context: any) => {
  const { amount, customerInfo, paymentToken, companyId } = data

  const idempotencyKey = getIdempotencyKey('credit', customerInfo.id, amount)

  const response = await axios.post(
    'https://api.efi.com.br/v1/charge/credit-card',
    {
      amount,
      customer: customerInfo,
      payment_token: paymentToken
    },
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.EFI_CLIENT_ID}:${process.env.EFI_CLIENT_SECRET}`).toString('base64')}`,
        'Idempotency-Key': idempotencyKey
      }
    }
  )

  return response.data
}
