import { cn } from "@/lib/utils";
import type { RFlexProps } from "@/Types/types";
import React from "react";

const RFlex = React.forwardRef<HTMLElement, RFlexProps>(
  ({ children, className, style, ...props }, ref) => {
    return (
      <section
        className={cn(`flex gap-[10px]`, className)}
        style={{
          ...style,
        }}
        ref={ref}
        {...props}
      >
        {children}
      </section>
    );
  }
);

RFlex.displayName = "RFlex";

export default React.memo(RFlex);
