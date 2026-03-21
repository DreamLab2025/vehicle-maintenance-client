import { useState, useEffect } from "react";
import { DigitWheel } from "./DigitWheelConfig";

export function OdometerRoller({
    digits = 6,
    value,
    onChange,
    minValue = 0,
    mode = "create",
  }: {
    digits?: number;
    value: number;
    onChange: (next: number) => void;
    minValue?: number;
    mode?: "create" | "update";
  }) {
    const max = Number("9".repeat(digits));
    // In create mode, no minValue constraint. In update mode, allow values below minValue to show validation error
    const clamp = (n: number) => Math.max(0, Math.min(n, max));
    const normalized = clamp(Number.isFinite(value) ? value : 0);
  
    const valueStr = String(normalized).padStart(digits, "0");
    const [digitsArr, setDigitsArr] = useState<number[]>(valueStr.split("").map((c) => Number(c)));
  
    useEffect(() => {
      const clampedValue = clamp(value);
      const s = String(clampedValue).padStart(digits, "0");
      const newDigits = s.split("").map((c) => Number(c));
      setDigitsArr(newDigits);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, digits, minValue, mode]);
  
    const commit = (nextDigits: number[]) => {
      setDigitsArr(nextDigits);
      const num = Number(nextDigits.join(""));
      const clamped = clamp(num);
      onChange(clamped);
    };
  
    return (
      <div className="flex items-center shrink-0">
        <div className="flex items-center gap-1 sm:gap-2.5">
          {Array.from({ length: digits }).map((_, idx) => (
            <DigitWheel
              key={idx}
              value={digitsArr[idx] ?? 0}
              onValue={(d) => {
                const next = [...digitsArr];
                next[idx] = d;
                commit(next);
              }}
            />
          ))}
        </div>
      </div>
    );
  }