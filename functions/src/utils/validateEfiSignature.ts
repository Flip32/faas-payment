import crypto from 'node:crypto'

export function validateEfiSignature(
  signature: string,
  rawBody: Buffer
): boolean {
  if (!process.env.EFI_WEBHOOK_SECRET) {
    console.error('EFI Webhook Secret is not set in environment variables.')
    throw new Error('EFI Webhook Secret is not set in environment variables.')
  }
  const expectedSignature = crypto
    .createHmac('sha256', process.env.EFI_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')

  return signature === expectedSignature
}
