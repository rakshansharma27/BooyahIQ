import Razorpay from 'razorpay'
import Stripe from 'stripe'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export const PREMIUM_PRICE_INR = 9900 // ₹99 in paise
export const PREMIUM_PRICE_USD = 199 // $1.99 in cents
