import { validateEfiSignature } from '../utils/validateEfiSignature'
import { db } from '../config'
import { sendMail } from '../mail/sendMail'
import * as functions from 'firebase-functions'
import dayjs from 'dayjs'

export const efiWebhook = async (req: any, res: any) => {
  const signature = req.headers['x-efi-signature'] as string
  const body = req.rawBody

  if (!validateEfiSignature(signature, body)) {
    console.error('Invalid EFI Signature')
    return res.status(401).send('Unauthorized')
  }

  const event = req.body

  console.log('Received EFI webhook event:', event)

  // EXEMPLO: tratamento de payment.success
  if (event.type === 'payment.success') {
    const companyId = event.data.company_id // ⚠️ Ajuste conforme payload real da EFI
    const planId = event.data.plan_id
    const periodicity = event.data.periodicity
    const paymentDate = dayjs().toDate()

    const subscriptionRef = db.collection('subscriptions').doc(companyId)

    // Exemplo de cálculo de monthsToAdd
    let monthsToAdd = 1
    if (periodicity === 'quarterly') monthsToAdd = 3
    if (periodicity === 'semiannual') monthsToAdd = 6
    if (periodicity === 'annual') monthsToAdd = 12

    // Cálculo de activeUntil (se já existe, soma a partir da data existente)
    const subscriptionSnap = await subscriptionRef.get()
    let baseDate = dayjs()
    if (subscriptionSnap.exists) {
      const data = subscriptionSnap.data()
      if (
        data?.activeUntil &&
        dayjs(data.activeUntil.toDate()).isAfter(baseDate)
      ) {
        baseDate = dayjs(data.activeUntil.toDate())
      }
    }

    const newActiveUntil = baseDate.add(monthsToAdd, 'month').toDate()

    await subscriptionRef.set(
      {
        companyId,
        planId,
        periodicity,
        activeUntil: newActiveUntil,
        lastPaymentStatus: 'success',
        lastPaymentAt: paymentDate,
        efiChargeId: event.data.charge_id || '',
        efiSubscriptionId: event.data.subscription_id || ''
      },
      { merge: true }
    )

    await sendMail({
      to: 'cliente@cliente.com.br', // ⚠️ ajuste real (email do cliente)
      subject: 'Pagamento aprovado!',
      text: `Seu pagamento foi aprovado com sucesso. Seu acesso está garantido até ${dayjs(newActiveUntil).format('DD/MM/YYYY')}.`
    })
  }

  // EXEMPLO: tratamento de payment.failed
  if (event.type === 'payment.failed') {
    const companyId = event.data.company_id

    const subscriptionRef = db.collection('subscriptions').doc(companyId)

    await subscriptionRef.set(
      {
        lastPaymentStatus: 'failed',
        lastPaymentAt: dayjs().toDate()
      },
      { merge: true }
    )

    await sendMail({
      to: 'cliente@cliente.com.br', // ⚠️ ajuste real (email do cliente)
      subject: 'Pagamento falhou!',
      text: 'Infelizmente seu pagamento não foi aprovado. Por favor, tente novamente para continuar com seu acesso.'
    })
  }

  return res.status(200).send('OK')
}
