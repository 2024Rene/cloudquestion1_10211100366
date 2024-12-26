import db from "@/db/db"
import { notFound } from "next/navigation"
import Stripe from "stripe"
import { CheckoutForm } from "./_components/CheckoutForm"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

type PageProps = {
  params: {
    id: string
  }
}

export default async function PurchasePage({ params }: PageProps) {
  const { id } = params // destructure to get the product ID

  // Fetch product details from the database
  const product = await db.product.findUnique({ where: { id } })
  if (product == null) return notFound()

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    metadata: { productId: product.id },
  })

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent")
  }

  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  )
}
