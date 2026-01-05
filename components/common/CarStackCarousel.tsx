"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
} from "framer-motion";
import {
  Users,
  SlidersHorizontal,
  ArrowUpRight,
  Star,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Car = {
  id: string;
  brand: string;
  model: string;
  rating: number;
  passengers: number;
  transmission: string;
  pricePerDay: number;
  imageUrl: string;
};

// ✅ CHỈ 3 SLOT (mỗi slot có thể Car hoặc null)
const userCars: Array<Car | null> = [
  {
    id: "1",
    brand: "Jaguar",
    model: "XE P250",
    rating: 4.8,
    passengers: 4,
    transmission: "Manual",
    pricePerDay: 4300,
    imageUrl:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1400&auto=format&fit=crop&q=80",
  },

  null, // 👈 slot nào null thì UI sẽ hiện grid add

  {
    id: "3",
    brand: "Audi",
    model: "A6 45",
    rating: 4.6,
    passengers: 5,
    transmission: "Auto",
    pricePerDay: 4100,
    imageUrl:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1400&auto=format&fit=crop&q=80",
  },
];

type Slot = { kind: "car"; car: Car } | { kind: "empty"; slotIndex: number };

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function RotaryCardCarousel() {
  const slots: Slot[] = React.useMemo(
    () =>
      userCars.map((c, i) =>
        c ? { kind: "car", car: c } : { kind: "empty", slotIndex: i }
      ),
    []
  );

  const [centerIndex, setCenterIndex] = React.useState(0);
  const [locked, setLocked] = React.useState(false);

  const idxCenter = mod(centerIndex, slots.length);
  const idxLeft = mod(centerIndex - 1, slots.length);
  const idxRight = mod(centerIndex + 1, slots.length);

  const center = slots[idxCenter];
  const left = slots[idxLeft];
  const right = slots[idxRight];

  // Preload ảnh để không khựng khi đổi card (chỉ preload khi slot là car)
  React.useEffect(() => {
    [center, left, right].forEach((s) => {
      if (s.kind !== "car") return;
      const img = new Image();
      img.src = s.car.imageUrl;
    });
  }, [idxCenter, idxLeft, idxRight]); // eslint-disable-line react-hooks/exhaustive-deps

  // Motion value cho card top
  const x = useMotionValue(0);

  // progress theo hướng kéo
  const rightProg = useTransform(x, [-150, 0], [1, 0], { clamp: true }); // kéo trái -> right nổi
  const leftProg = useTransform(x, [0, 150], [0, 1], { clamp: true }); // kéo phải -> left nổi

  // Base style cho 2 card sau
  const baseY = 26;
  const baseScale = 0.92;
  const baseOpacity = 0.33;

  // Left back -> trồi lên khi kéo phải
  const leftX = useTransform(leftProg, [0, 1], [-64, -18]);
  const leftY = useTransform(leftProg, [0, 1], [baseY, 10]);
  const leftScale = useTransform(leftProg, [0, 1], [baseScale, 0.985]);
  const leftOpacity = useTransform(leftProg, [0, 1], [baseOpacity, 0.78]);
  const leftRot = useTransform(leftProg, [0, 1], [-2.4, -0.8]);

  // Right back -> trồi lên khi kéo trái
  const rightX = useTransform(rightProg, [0, 1], [64, 18]);
  const rightY = useTransform(rightProg, [0, 1], [baseY, 10]);
  const rightScale = useTransform(rightProg, [0, 1], [baseScale, 0.985]);
  const rightOpacity = useTransform(rightProg, [0, 1], [baseOpacity, 0.78]);
  const rightRot = useTransform(rightProg, [0, 1], [2.4, 0.8]);

  // Top card tilt nhẹ theo kéo
  const topRotate = useTransform(x, [-160, 0, 160], [-5, 0, 5]);
  const topScale = useTransform(x, [-160, 0, 160], [0.985, 1, 0.985]);

  const commitRotate = (dir: -1 | 1, target: number) => {
    setLocked(true);

    // fling ra nhanh (tween) => mượt, không lắc
    animate(x, target, { type: "tween", duration: 0.18, ease: "easeOut" }).then(
      () => {
        setCenterIndex((v) => v + dir);
        x.set(0); // reset ngay lập tức tránh “giật”
        setLocked(false);
      }
    );
  };

  const onDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (locked) return;

    const threshold = 90;
    const offset = info.offset.x;

    // không đủ ngưỡng => snap về giữa bằng spring nhanh
    if (Math.abs(offset) < threshold) {
      animate(x, 0, { type: "spring", stiffness: 650, damping: 42 });
      return;
    }

    // kéo phải => qua card trái (dir -1), kéo trái => qua card phải (dir +1)
    if (offset > 0) commitRotate(-1, 260);
    else commitRotate(1, -260);
  };

  return (
    <div className="grid min-h-[70vh] place-items-center">
      <div className="relative h-[560px] w-[340px] select-none">
        {/* LEFT back card */}
        <motion.div
          className="absolute inset-0"
          style={{
            x: leftX,
            y: leftY,
            scale: leftScale,
            opacity: leftOpacity,
            rotateZ: leftRot,
            zIndex: 10,
            pointerEvents: "none",
            filter: "blur(0.2px)",
          }}
        >
          <SlotCard slot={left} muted />
        </motion.div>

        {/* RIGHT back card */}
        <motion.div
          className="absolute inset-0"
          style={{
            x: rightX,
            y: rightY,
            scale: rightScale,
            opacity: rightOpacity,
            rotateZ: rightRot,
            zIndex: 10,
            pointerEvents: "none",
            filter: "blur(0.2px)",
          }}
        >
          <SlotCard slot={right} muted />
        </motion.div>

        {/* TOP draggable card */}
        <motion.div
          className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
          style={{ x, rotateZ: topRotate, scale: topScale }}
          drag={locked ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={onDragEnd}
        >
          <SlotCard slot={center} />
        </motion.div>
      </div>
    </div>
  );
}

function SlotCard({ slot, muted }: { slot: Slot; muted?: boolean }) {
  // ✅ null => fallback grid add
  if (slot.kind === "empty") return <AddCarCard muted={muted} />;

  return <CarCard car={slot.car} muted={muted} />;
}

function AddCarCard({ muted }: { muted?: boolean }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/vehicle/add")}
      type="button"
      aria-label="Add vehicle"
      className={[
        "h-full w-full rounded-[28px]",
        "bg-white",
        "shadow-[0_22px_70px_rgba(0,0,0,0.45)]",
        "transition",
        muted ? "saturate-50" : "hover:scale-[0.995]",
      ].join(" ")}
    >
      {/* INNER FRAME */}
      <div className="h-full w-full p-4">
        <div
          className="
            h-full w-full
            rounded-[22px]
            border border-dashed border-black/25
            grid place-items-center
          "
        >
          <div className="grid place-items-center gap-3">
            {/* plus */}
            <div
              className="
                grid h-16 w-16 place-items-center
                rounded-full
                bg-red-500 text-white
                shadow-[0_16px_35px_rgba(239,68,68,0.35)]
              "
            >
              <Plus className="h-7 w-7" />
            </div>

            {/* label */}
            <p className="text-[13px] font-medium tracking-wide text-black/55">
              Add vehicle
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

function CarCard({ car, muted }: { car: Car; muted?: boolean }) {
  return (
    <div
      className={[
        "h-full w-full rounded-[28px] overflow-hidden",
        "bg-white",
        "shadow-[0_22px_70px_rgba(0,0,0,0.45)]",
        muted ? "saturate-50" : "ring-1 ring-black/10",
      ].join(" ")}
    >
      <div className="p-6">
        {/* top row */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[26px] font-semibold tracking-wide text-black/95">
              {car.brand}
            </p>
            <p className="mt-1 text-[44px] font-medium tracking-[0.06em] text-black/60">
              {car.model}
            </p>

            <div className="mt-3 flex items-center gap-3 text-sm text-black/55">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {car.passengers} Passagers
              </span>
              <span className="text-black/35">•</span>
              <span className="inline-flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4" />
                {car.transmission}
              </span>
            </div>
          </div>

          <div className="mt-2 inline-flex items-center gap-1 text-sm text-black/70">
            <Star className="h-4 w-4 text-red-300" />
            <span className="font-medium">{car.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* car image */}
        <div className="mt-8 flex justify-center">
          <img
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            className={[
              "h-[230px] w-[310px] object-contain",
              "drop-shadow-[0_22px_30px_rgba(0,0,0,0.55)]",
              muted ? "opacity-70" : "",
            ].join(" ")}
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* bottom */}
        <div className="mt-8 flex items-end justify-between">
          <div>
            <p className="text-sm text-black/50">Price</p>
            <p className="mt-1 text-[20px] font-semibold text-black/90">
              ${car.pricePerDay.toLocaleString()}
              <span className="text-black/45">/day</span>
            </p>
          </div>

          {/* white-red theme CTA */}
          <button
            type="button"
            className="
              grid h-14 w-14 place-items-center rounded-full
              bg-red-500 text-white
              shadow-[0_16px_35px_rgba(239,68,68,0.40)]
              active:scale-95
            "
            aria-label="Open"
          >
            <ArrowUpRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
