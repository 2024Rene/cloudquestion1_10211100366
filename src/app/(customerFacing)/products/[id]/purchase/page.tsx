import db from "@/db/db"
import { notFound } from "next/navigation"
import Stripe from "stripe"
import { CheckoutForm } from "./_components/CheckoutForm"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

type PageProps = {
  params: { id: string }
}

// Using Next.js 13+ App Router and async components to handle dynamic routes
export default async function PurchasePage({ params }: PageProps) {
  const { id } = params // Destructure the `id` from params

  // Fetch product data from the database using the `id`
  const product = await db.product.findUnique({ where: { id } })
  
  // If the product is not found, return a 404 page
  if (product == null) return notFound()

  // Create a payment intent with Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,  // The product's price
    currency: "USD",               // The currency for the payment
    metadata: { productId: product.id },  // Metadata for the payment
  })

  // If Stripe fails to create a payment intent, throw an error
  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent")
  }

  // Render the CheckoutForm component with product and clientSecret data
  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  )
}
