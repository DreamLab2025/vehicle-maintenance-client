"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortKey = "name" | "brand" | "price" | "createdAt";
type SortDir = "asc" | "desc";

export default function ProductsToolbar(props: {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onSortKeyChange: (v: SortKey) => void;
  onSortDirChange: (v: SortDir) => void;
  isLoading: boolean;
  onRefresh: () => void;
}) {
  const {
    searchTerm,
    onSearchChange,
    sortKey,
    sortDir,
    onSortKeyChange,
    onSortDirChange,
    isLoading,
    onRefresh,
  } = props;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-3">
      <input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Tìm theo tên / hãng / category…"
        className="h-10 w-full md:w-[360px] rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
      />

      <div className="flex gap-2 items-center">
        <select
          value={sortKey}
          onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
        >
          <option value="createdAt">Mới nhất</option>
          <option value="name">Tên</option>
          <option value="brand">Hãng</option>
          <option value="price">Giá</option>
        </select>

        <select
          value={sortDir}
          onChange={(e) => onSortDirChange(e.target.value as SortDir)}
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
        >
          <option value="desc">Giảm dần</option>
          <option value="asc">Tăng dần</option>
        </select>

        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          className="border-slate-200"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
