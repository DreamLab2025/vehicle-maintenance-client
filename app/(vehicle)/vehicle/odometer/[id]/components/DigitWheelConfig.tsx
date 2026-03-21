import { useMemo, useRef, useState, useEffect } from "react";
import { useMotionValue, animate } from "framer-motion";
import { motion } from "framer-motion";

export function DigitWheel({ value, onValue }: { value: number; onValue: (d: number) => void }) {
    const digitH = 56;
    const itemH = 40;
  
    const items = useMemo(() => {
      const base = Array.from({ length: 10 }, (_, i) => i);
      return [...base, ...base, ...base];
    }, []);
  
    const midStart = 10;
    const maxIndex = items.length - 1;
  
    const y = useMotionValue(-(midStart + value) * itemH);
    const [localDigit, setLocalDigit] = useState<number>(value);
    const draggingRef = useRef(false);
  
    const digitFromY = (curY: number) => {
      const idx = Math.round(Math.abs(curY) / itemH);
      const safe = Math.max(0, Math.min(maxIndex, idx));
      return items[safe] ?? 0;
    };
  
    const recenterIfNeeded = (curY: number) => {
      const idx = Math.round(Math.abs(curY) / itemH);
      if (idx < 6 || idx > 23) {
        const digit = items[Math.max(0, Math.min(maxIndex, idx))] ?? 0;
        const midIdx = midStart + digit;
        const nextY = -midIdx * itemH;
        y.set(nextY);
        return nextY;
      }
      return curY;
    };
  
    const snapToDigit = (digit: number) => {
      const midIdx = midStart + digit;
      const targetY = -midIdx * itemH;
      animate(y, targetY, { type: "spring", stiffness: 420, damping: 36 });
    };
  
    useEffect(() => {
      if (draggingRef.current) return;
      setLocalDigit(value);
      y.stop();
      y.set(-(midStart + value) * itemH);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
  
    const onWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = (localDigit + dir + 10) % 10;
      setLocalDigit(next);
      onValue(next);
      snapToDigit(next);
    };
  
    return (
      <div className="select-none w-[42px] sm:w-[56px]">
        <motion.div className="relative mx-auto overflow-hidden rounded-2xl" style={{ height: digitH }} onWheel={onWheel}>
          <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-white shadow-sm" />
  
          <div
            className="pointer-events-none absolute left-2 right-2 top-1/2 -translate-y-1/2 rounded-xl border border-black/10 bg-black/[0.03]"
            style={{ height: itemH }}
          />
  
          <motion.div
            drag="y"
            dragElastic={0.12}
            dragMomentum={true}
            style={{
              y,
              paddingTop: (digitH - itemH) / 2,
              paddingBottom: (digitH - itemH) / 2,
            }}
            onDragStart={() => {
              draggingRef.current = true;
            }}
            onDrag={() => {
              const cur = recenterIfNeeded(y.get());
              const d = digitFromY(cur);
              setLocalDigit((prev) => (prev === d ? prev : d));
            }}
            onDragEnd={() => {
              draggingRef.current = false;
              const cur = recenterIfNeeded(y.get());
              const d = digitFromY(cur);
              setLocalDigit(d);
              onValue(d);
              snapToDigit(d);
            }}
          >
            {items.map((n, i) => (
              <div key={`${n}-${i}`} className="flex items-center justify-center" style={{ height: itemH }}>
                <span
                  className={`font-extrabold tracking-tight ${n === localDigit ? "text-gray-900" : "text-gray-400"}`}
                  style={{
                    fontSize: n === localDigit ? 26 : 22,
                    lineHeight: 1,
                  }}
                >
                  {n}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }