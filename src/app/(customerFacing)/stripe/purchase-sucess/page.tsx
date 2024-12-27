import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const createDownloadVerification = async (productId: string): Promise<string> => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 12); // Example: expires in 24 hours

  const result = await db.downloadVerification.create({
    data: { 
      productId, 
      expiresAt,  // Add expiration date here
    },
  });

  return result.id;  // Return the ID of the created download verification
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Resolve `searchParams` from the Promise
  const resolvedParams = await searchParams;

  const paymentIntentId = resolvedParams.payment_intent;

  // Validate `payment_intent` exists and is a string
  if (!paymentIntentId || typeof paymentIntentId !== "string") {
    return notFound();
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  // Ensure the metadata includes a valid `productId`
  if (!paymentIntent.metadata.productId) {
    return notFound();
  }

  const product = await db.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  });

  if (!product) {
    return notFound();
  }

  const isSuccess = paymentIntent.status === "succeeded";

  // Resolve the download verification before returning the JSX
  const downloadVerificationId = isSuccess
    ? await createDownloadVerification(product.id)
    : null;

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">{isSuccess ? "Success!" : "Error!"}</h1>
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-lg">{formatCurrency(product.priceInCents / 100)}</div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">{product.description}</div>
          <Button className="mt-4" size="lg" asChild>
            {isSuccess ? (
              <a href={`/products/download/${downloadVerificationId}`}>
                Download
              </a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
