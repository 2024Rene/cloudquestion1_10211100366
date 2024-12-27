import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const createDownloadVerification = async (productId: string): Promise<string> => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 12); // Example: expires in 12 hours

  try {
    const result = await db.downloadVerification.create({
      data: { 
        productId, 
        expiresAt, 
      },
    });
    console.log("Download verification created:", result.id);
    return result.id; // Return the ID of the created download verification
  } catch (error) {
    console.error("Error creating download verification:", error);
    throw error;
  }
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  try {
    // Resolve `searchParams` from the Promise
    const resolvedParams = await searchParams;
    console.log("Search Params:", resolvedParams);

    const paymentIntentId = resolvedParams.payment_intent;

    // Validate `payment_intent` exists and is a string
    if (!paymentIntentId || typeof paymentIntentId !== "string") {
      console.error("Invalid Payment Intent ID:", paymentIntentId);
      return notFound();
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log("Retrieved Payment Intent:", paymentIntent);

    // Ensure the metadata includes a valid `productId`
    if (!paymentIntent.metadata || !paymentIntent.metadata.productId) {
      console.error("Missing Product ID in Payment Intent Metadata");
      return notFound();
    }

    const productId = paymentIntent.metadata.productId;

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.error("Product not found:", productId);
      return notFound();
    }

    console.log("Product found:", product);

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
            <div className="text-lg">
              {formatCurrency(product.priceInCents / 100)}
            </div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="line-clamp-3 text-muted-foreground">
              {product.description}
            </div>
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
  } catch (error) {
    console.error("Error rendering success page:", error);
    return notFound();
  }
}
