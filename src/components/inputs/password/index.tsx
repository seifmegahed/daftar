import { forwardRef, useState } from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
      <div className="relative flex items-center">
        <Input
          type={isVisible ? "" : "password"}
          className={className}
          ref={ref}
          {...props}
        />
        <button
          className="absolute end-2 text-muted-foreground"
          onClick={() => setIsVisible((prev) => !prev)}
        >
          {isVisible ? <EyeOff /> : <Eye />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
