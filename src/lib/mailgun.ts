import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILGUN_SMTP_LOGIN || `postmaster@${process.env.MAILGUN_DOMAIN}`,
    pass: process.env.MAILGUN_API_KEY,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const from = process.env.MAILGUN_FROM || 'BooyahIQ <noreply@booyahiq.me>'
  
  try {
    await transporter.sendMail({ from, to, subject, html })
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}

export function getWelcomeEmail(playerName: string) {
  return `
    <div style="font-family: Arial, sans-serif; background: #080a0f; color: #fff; padding: 40px; max-width: 600px;">
      <h1 style="color: #00ff88; font-size: 28px;">Welcome to BooyahIQ! 🎮</h1>
      <p>Hey ${playerName},</p>
      <p>Your Free Fire intelligence platform is ready. Win Smarter. Play Harder.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
         style="background: #00ff88; color: #080a0f; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-top: 20px;">
        Go to Dashboard →
      </a>
    </div>
  `
}

export function getPasswordResetEmail(resetUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; background: #080a0f; color: #fff; padding: 40px; max-width: 600px;">
      <h1 style="color: #00ff88; font-size: 28px;">Reset Your Password</h1>
      <p>Click the button below to reset your BooyahIQ password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" 
         style="background: #00ff88; color: #080a0f; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-top: 20px;">
        Reset Password →
      </a>
      <p style="color: #666; margin-top: 20px; font-size: 14px;">If you didn't request this, ignore this email.</p>
    </div>
  `
}

export function getPaymentConfirmEmail(playerName: string, plan: string) {
  return `
    <div style="font-family: Arial, sans-serif; background: #080a0f; color: #fff; padding: 40px; max-width: 600px;">
      <h1 style="color: #ffd700; font-size: 28px;">👑 Premium Activated!</h1>
      <p>Hey ${playerName},</p>
      <p>Your ${plan} subscription is now active. Enjoy zero ads, unlimited searches, and your premium badge!</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
         style="background: #ffd700; color: #080a0f; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-top: 20px;">
        Go to Dashboard →
      </a>
    </div>
  `
}

export function getTournamentContactEmail(tournament: string, contactName: string, contactEmail: string, message: string) {
  return `
    <div style="font-family: Arial, sans-serif; background: #080a0f; color: #fff; padding: 40px; max-width: 600px;">
      <h1 style="color: #00ff88; font-size: 28px;">New Tournament Inquiry</h1>
      <p><strong>Tournament:</strong> ${tournament}</p>
      <p><strong>From:</strong> ${contactName} (${contactEmail})</p>
      <p><strong>Message:</strong> ${message}</p>
    </div>
  `
}
