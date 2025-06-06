import crypto from 'node:crypto'

export function getIdempotencyKey(
  prefix: string,
  customerId: string,
  reference: string | number
): string {
  return crypto
    .createHash('sha256')
    .update(`${prefix}-${customerId}-${reference}`)
    .digest('hex')
}
