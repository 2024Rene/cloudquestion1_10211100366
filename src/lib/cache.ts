import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"

// Define a type for the callback function with properly inferred argument and return types
type Callback<Args extends any[] = any[], Return = any> = (...args: Args) => Promise<Return>;

export function cache<T extends Callback>(
  cb: T,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {}
) {
  return nextCache(reactCache(cb), keyParts, options)
}
