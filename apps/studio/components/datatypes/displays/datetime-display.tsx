import { GenericDisplayProps } from "../generic-display";

export type DateTimeDisplayProps = Omit<GenericDisplayProps, "value"> & {
  value: number;
};

export default function DateTimeDisplay({
  value,
  className,
}: DateTimeDisplayProps) {
  const string = new Date(value).toLocaleString();
  return <span className={className}>{string}</span>;
}
