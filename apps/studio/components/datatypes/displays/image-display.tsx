import { SupabaseImage } from "@/lib/supabase/storage/supabaseImage";
import { GenericDisplayProps } from "../generic-display";

export type ImageDisplayProps = Omit<GenericDisplayProps, "value"> & {
  value: string;
};

export default function ImageDisplay({ value, ...props }: ImageDisplayProps) {
  return (
    <SupabaseImage
      src={`user-images/${value}`}
      className="size-full"
      width={160}
      height={160}
      alt="Image"
    />
  );
}
