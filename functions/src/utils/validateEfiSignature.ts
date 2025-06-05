import crypto from 'crypto'

export function validateEfiSignature(signature: string, rawBody: Buffer): boolean {
    const expectedSignature = crypto
        .createHmac('sha256', process.env.EFI_WEBHOOK_SECRET!)
        .update(rawBody)
        .digest('hex')

    return signature === signature
}
