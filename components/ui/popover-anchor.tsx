"\"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

const PopoverAnchor = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Anchor>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>
>(({ children, ...props }, ref) => (
  <PopoverPrimitive.Anchor ref={ref} {...props}>
    {children}
  </PopoverPrimitive.Anchor>
))
PopoverAnchor.displayName = PopoverPrimitive.Anchor.displayName

export { PopoverAnchor }
