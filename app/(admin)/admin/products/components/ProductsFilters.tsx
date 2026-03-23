"use client";

export type ProductStatusFilter = "All" | "Active" | "Inactive";

export default function ProductsFilters(props: {
  status: ProductStatusFilter;
  onStatusChange: (v: ProductStatusFilter) => void;
}) {
  const { status, onStatusChange } = props;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
      <span className="text-sm text-slate-600">Trạng thái:</span>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as ProductStatusFilter)}
        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
      >
        <option value="All">Tất cả</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}
