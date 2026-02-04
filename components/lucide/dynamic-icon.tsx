"use client";
import dynamic from "next/dynamic";
import { LucideProps, icons } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { memo } from "react";

interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports;
}

export const DynamicIcon = memo(({ name, ...props }: IconProps) => {
  const LucideIcon = dynamic(dynamicIconImports[name]);
  return <LucideIcon {...props} />;
});

DynamicIcon.displayName = "DynamicIcon";


export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name as keyof typeof icons];
  return <LucideIcon  {...props} />;
};
