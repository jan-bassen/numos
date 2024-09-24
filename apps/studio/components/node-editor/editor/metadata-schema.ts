import {
  integerSchema,
  numberSchema,
  stringSchema,
} from "@/components/datatypes/schemas";
import { z } from "zod";

export const metadataSchema = z.object({
  id: integerSchema.min(0, "Must be positive"),
  name: stringSchema,
  description: stringSchema,
});

export const optionalMetadataSchema = z
  .object({
    id: integerSchema.min(0, "Must be positive").nullable().optional(),
    name: stringSchema.nullable().optional(),
    description: stringSchema.nullable().optional(),
  })
  .nullable()
  .optional();
