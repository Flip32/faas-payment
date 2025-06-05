import * as functions from 'firebase-functions'
import { payWithPix } from './payments/payWithPix'
import { payWithCreditSubscription } from './payments/payWithCreditSubscription'
import { payWithCredit } from './payments/payWithCredit'
import { payWithBoleto } from './payments/payWithBoleto'
import { efiWebhook } from './webhooks/efiWebhook'

export const payWithPixFunction = functions.https.onCall(payWithPix)
export const payWithCreditSubscriptionFunction = functions.https.onCall(payWithCreditSubscription)
export const payWithCreditFunction = functions.https.onCall(payWithCredit)
export const payWithBoletoFunction = functions.https.onCall(payWithBoleto)

export const efiWebhookFunction = functions.https.onRequest(efiWebhook)
