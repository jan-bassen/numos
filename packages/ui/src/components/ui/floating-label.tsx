import type * as React from 'react'

import { cn } from '@repo/ui/lib/utils'
import { Label } from './label'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/* const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        placeholder=" "
        className={cn("peer", className)}
        ref={ref}
        {...props}
      />
    );
  },
);
FloatingInput.displayName = "FloatingInput"; */

const FloatingLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof Label>) => {
  return (
    <Label
      className={cn(
        'peer-focus:secondary peer-focus:dark:secondary -translate-y-4 peer-placeholder-shown:-translate-y-1/2 peer-focus:-translate-y-4 absolute start-2 top-2 z-10 origin-[0] scale-75 transform bg-background px-2 text-gray-500 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-background',
        className,
      )}
      {...props}
    />
  )
}
FloatingLabel.displayName = 'FloatingLabel'

/* type FloatingLabelInputProps = InputProps & { label?: string };

const FloatingLabelInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingInput ref={ref} id={id} {...props} />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
    </div>
  );
});
FloatingLabelInput.displayName = "FloatingLabelInput"; */

export { FloatingLabel }
