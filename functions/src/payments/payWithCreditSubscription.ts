import axios from 'axios'
import { db } from '../config'
import { getIdempotencyKey } from '../utils/idempotency'

export const payWithCreditSubscription = async (data: any, context: any) => {
  const { planId, periodicity, customerInfo, paymentToken, companyId } = data

  const planSnap = await db.collection('plans').doc(planId).get()
  if (!planSnap.exists) {
    throw new Error('Plano inválido')
  }

  const planData = planSnap.data()
  const periodData = planData?.periods?.[periodicity]
  if (!periodData) {
    throw new Error('Periodicidade inválida')
  }

  const priceCents = periodData.priceCents

  const idempotencyKey = getIdempotencyKey(
    'credit-subscription',
    customerInfo.id,
    `${planId}-${periodicity}`
  )

  const response = await axios.post(
    'https://api.efi.com.br/v1/subscription',
    {
      plan_id: planData.efiPlanId,
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
