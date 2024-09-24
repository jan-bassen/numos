import { GenericDisplayProps } from "../generic-display";

export type AddressDisplayProps = Omit<GenericDisplayProps, "value"> & {
  value: string;
};

export default function AddressDisplay({
  value,
  className,
}: AddressDisplayProps) {
  return (
    <span className={className}>
      {value.slice(0, 5)}...{value.slice(-3)}
    </span>
  );
}
