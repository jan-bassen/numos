import { isCollectionSlugTaken } from "@/lib/db/queries/collections";
import { z } from "zod";

export const collectionSchema = (currentSlug: string | undefined) =>
  z.object({
    name: z
      .string()
      .max(40, {
        message: "Name must be less than 40 characters.",
      })
      .optional(),
    slug: z
      .string({
        error: "We need a unique identifier to differentiate this collection from others",
      })
      .max(40, {
        message: "Identifier must be less than 40 characters.",
      })
      .regex(/^[a-zA-Z0-9-_]+$/, {
        message: "Identifier must be alphanumeric, dashes, or underscores.",
      })
      .refine(
        async (slug) => {
          if (slug === currentSlug) {
            return true;
          }
          const isTaken = await isCollectionSlugTaken(slug);
          return !isTaken;
        },
        { message: "Identifier already taken" }
      ),
    description: z
      .string()
      .max(500, {
        message: "Description must be less than 500 characters.",
      })
      .optional(),
    symbol: z
      .string()
      .max(10, {
        message: "Symbol must be less than 10 characters.",
      })
      .optional(),
    external_link: z.string().url().optional(),
    image: z.string().uuid().optional(),
    max_supply: z.coerce
      .number()
      .int()
      .min(-1, { message: "Must be positive" })
      .max(100000, {
        message:
          "We're only supporting up to 100.000 Tokens per collection for now. Contact us if you need more.",
      })
      .optional(),
  });
