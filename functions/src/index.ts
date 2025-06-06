import { https } from 'firebase-functions'
import { payWithBoleto } from './payments/payWithBoleto'
import { payWithCredit } from './payments/payWithCredit'
import { payWithCreditSubscription } from './payments/payWithCreditSubscription'
import { payWithPix } from './payments/payWithPix'
import { efiWebhook } from './webhooks/efiWebhook'

export const payWithPixFunction = https.onCall(payWithPix)
export const payWithCreditSubscriptionFunction = https.onCall(
  payWithCreditSubscription
)
export const payWithCreditFunction = https.onCall(payWithCredit)
export const payWithBoletoFunction = https.onCall(payWithBoleto)

export const efiWebhookFunction = https.onRequest(efiWebhook)
