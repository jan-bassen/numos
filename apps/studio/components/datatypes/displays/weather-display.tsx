import { WeatherCode } from "@/types/database.types";
import { GenericDisplayProps } from "../generic-display";
import { weatherConditions } from "@/lib/supabase/constants/weather";

export type WeatherDisplayProps = Omit<GenericDisplayProps, "value"> & {
  value: WeatherCode;
};

export default function WeatherDisplay({
  value,
  className,
}: WeatherDisplayProps) {
  return <span className={className}>{weatherConditions[value]?.name}</span>;
}
