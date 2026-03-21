"use client";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface InputOTPCustomProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export default function InputOTPCustom({
  value = "",
  onChange,
  maxLength = 6,
  disabled = false,
  autoFocus = false,
  className,
}: InputOTPCustomProps) {
  return (
    <div className={className} data-otp-input>
      <InputOTP
        maxLength={maxLength}
        value={value}
        onChange={(val) => {
          onChange?.(val);
        }}
        disabled={disabled}
        autoFocus={autoFocus}
      >
        <InputOTPGroup className="space-x-2">
          <InputOTPSlot index={0} className="rounded-md border-l" />
          <InputOTPSlot index={1} className="rounded-md border-l" />
          <InputOTPSlot index={2} className="rounded-md border-l" />
          <InputOTPSlot index={3} className="rounded-md border-l" />
          <InputOTPSlot index={4} className="rounded-md border-l" />
          <InputOTPSlot index={5} className="rounded-md border-l" />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
