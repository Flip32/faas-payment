import nodemailer from 'nodemailer'

export const sendMail = async ({
  to,
  subject,
  text
}: { to: string; subject: string; text: string }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_USER!,
      pass: process.env.ZOHO_PASS!
    }
  })

  await transporter.sendMail({
    from: process.env.ZOHO_USER!,
    to,
    subject,
    text
  })
}
