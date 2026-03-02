import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ─── Table/List Skeleton ────────────────────────────────────────

export function TableSkeleton({ rows = 6, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm", className)}>
      <div className="h-12 bg-slate-50 border-b border-slate-100">
        <Skeleton className="h-full w-full" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 p-4 border-b border-slate-50 items-center last:border-b-0"
        >
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-2/4" />
          <Skeleton className="h-4 w-1/4 ml-auto" />
        </div>
      ))}
    </div>
  );
}

// ─── Table with Image Skeleton ──────────────────────────────────

export function TableWithImageSkeleton({ rows = 6, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm", className)}>
      <div className="h-12 bg-slate-50 border-b border-slate-100">
        <Skeleton className="h-full w-full" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 p-4 border-b border-slate-50 items-center last:border-b-0"
        >
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/5" />
          <Skeleton className="h-4 w-2/5 ml-auto" />
        </div>
      ))}
    </div>
  );
}

// ─── Card Skeleton ─────────────────────────────────────────────

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-2xl p-4", className)}>
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

// ─── Vehicle Card Skeleton ──────────────────────────────────────

export function VehicleCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("h-[200px] rounded-[20px] bg-white overflow-hidden relative", className)}>
      <Skeleton className="h-full w-full" />
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="flex-1 h-16 rounded-xl" />
          <Skeleton className="flex-1 h-16 rounded-xl" />
          <Skeleton className="h-16 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Vehicle Card Grid Skeleton ─────────────────────────────────

export function VehicleCardGridSkeleton({ count = 2, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Category Card Skeleton ────────────────────────────────────

export function CategoryCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full flex items-center gap-4 p-3 rounded-lg border border-neutral-200 bg-white", className)}>
      <Skeleton className="w-16 h-16 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

// ─── Category List Skeleton ─────────────────────────────────────

export function CategoryListSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Product Card Skeleton ──────────────────────────────────────

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full flex items-center gap-4 p-3 rounded-lg border border-neutral-200 bg-white", className)}>
      <Skeleton className="w-16 h-16 rounded-xl" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

// ─── Product List Skeleton ──────────────────────────────────────

export function ProductListSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Notification Skeleton ─────────────────────────────────────

export function NotificationSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full flex items-start gap-3.5 px-4 py-4 bg-white", className)}>
      <Skeleton className="w-11 h-11 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-12 flex-shrink-0" />
        </div>
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

// ─── Notification List Skeleton ──────────────────────────────────

export function NotificationListSkeleton({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-0", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {i > 0 && <div className="h-px bg-neutral-100 ml-[76px] mr-4" />}
          <NotificationSkeleton />
        </div>
      ))}
    </div>
  );
}

// ─── Reminder Card Skeleton ────────────────────────────────────

export function ReminderCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-2xl p-4 flex items-center gap-3.5 shadow-sm", className)}>
      <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
        <Skeleton className="h-3 w-full" />
      </div>
      <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
    </div>
  );
}

// ─── Reminder List Skeleton ─────────────────────────────────────

export function ReminderListSkeleton({ count = 2, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ReminderCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Home Page Skeleton ────────────────────────────────────────

export function HomePageSkeleton() {
  return (
    <div className="px-5 pt-6 pb-32 space-y-6">
      {/* Vehicle Card */}
      <Skeleton className="h-[200px] rounded-[20px]" />
      
      {/* Undeclared Parts */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      </div>
      
      {/* Reminders */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

// ─── Vehicle Detail Skeleton ───────────────────────────────────

export function VehicleDetailSkeleton() {
  return (
    <div className="min-h-dvh bg-neutral-50">
      <div className="mx-auto max-w-md">
        {/* Hero Section */}
        <Skeleton className="h-[300px] rounded-bl-3xl rounded-br-3xl" />
        
        {/* Content */}
        <div className="px-5 pt-6 space-y-6">
          {/* Specifications */}
          <div>
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2.5">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-b-0">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Odometer History */}
          <div>
            <Skeleton className="h-5 w-40 mb-3" />
            <Skeleton className="h-[200px] rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Parts Grid Skeleton ────────────────────────────────────────

export function PartsGridSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-4 gap-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-2xl" />
      ))}
    </div>
  );
}

// ─── Loading Spinner with Text ──────────────────────────────────

export function LoadingSpinner({ 
  text, 
  className 
}: { 
  text?: string; 
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20", className)}>
      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
      {text && <p className="text-sm font-medium text-neutral-400">{text}</p>}
    </div>
  );
}

// ─── Maintenance Form Skeleton ──────────────────────────────────

export function MaintenanceFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Vehicle Selection */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <VehicleCardGridSkeleton count={2} />
      </div>
      
      {/* Category Selection */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <CategoryListSkeleton count={3} />
      </div>
      
      {/* Product Selection */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <ProductListSkeleton count={3} />
      </div>
    </div>
  );
}
