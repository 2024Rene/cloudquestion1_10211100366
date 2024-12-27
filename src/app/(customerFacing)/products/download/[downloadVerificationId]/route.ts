import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";
import fs from "fs/promises";

// Define the GET handler
export async function GET(req: NextRequest, context: { params: Promise<{ downloadVerificationId: string }> }) {
  // Await the params since they are wrapped in a Promise
  const { downloadVerificationId } = await context.params;

  // Query the database for the file information
  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } },
  });

  // If no data is found or it has expired, redirect to expired page
  if (data == null) {
    return NextResponse.redirect(new URL("/products/download/expired", req.url));
  }

  // Get file size and content
  const { size } = await fs.stat(data.product.filePath);
  const file = await fs.readFile(data.product.filePath);
  const extension = data.product.filePath.split(".").pop();

  // Return the file as a response with appropriate headers for downloading
  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  });
}
