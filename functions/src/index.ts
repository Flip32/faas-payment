import * as functions from 'firebase-functions'
import { payWithBoleto } from './payments/payWithBoleto'
import { payWithCredit } from './payments/payWithCredit'
import { payWithCreditSubscription } from './payments/payWithCreditSubscription'
import { payWithPix } from './payments/payWithPix'
import { efiWebhook } from './webhooks/efiWebhook'

export const payWithPixFunction = functions.https.onCall(payWithPix)
export const payWithCreditSubscriptionFunction = functions.https.onCall(
  payWithCreditSubscription
)
export const payWithCreditFunction = functions.https.onCall(payWithCredit)
export const payWithBoletoFunction = functions.https.onCall(payWithBoleto)

export const efiWebhookFunction = functions.https.onRequest(efiWebhook)
