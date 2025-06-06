import axios from 'axios'
import type { https } from 'firebase-functions'
import type { PaymentDataType } from '../domain/payments'
import { getIdempotencyKey } from '../utils/idempotency'

export const payWithPix = async (
  data: PaymentDataType,
  context: https.CallableContext
) => {
  const { amount, customerInfo, companyId } = data

  const idempotencyKey = getIdempotencyKey('pix', customerInfo.id, amount)

  const response = await axios.post(
    'https://api.efi.com.br/v1/charge/pix',
    {
      amount,
      customer: customerInfo
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
