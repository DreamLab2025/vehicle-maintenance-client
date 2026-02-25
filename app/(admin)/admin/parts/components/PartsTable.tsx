// src/components/admin/parts/components/PartsTable.tsx
"use client";

import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PartCategory } from "@/lib/api/services/fetchPartCategories";

type Props = {
  data: PartCategory[];
  onEdit: (v: PartCategory) => void;
  onDelete: (v: PartCategory) => void;
  isDeletingId: string | null;
  disabled?: boolean;
};

export default function PartsTable({
  data,
  onEdit,
  onDelete,
  isDeletingId,
  disabled,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[72px]">Icon</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead className="w-[160px]">Code</TableHead>
            <TableHead className="w-[140px]">Tracking</TableHead>
            <TableHead className="w-[120px]">Order</TableHead>
            <TableHead className="w-[190px]">Tạo lúc</TableHead>
            <TableHead className="w-[160px] text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((v) => {
            const created = v.createdAt
              ? new Date(v.createdAt).toLocaleString()
              : "-";
            return (
              <TableRow key={v.id} className="hover:bg-slate-50/60">
                <TableCell>
                  {v.iconUrl ? (
                    <a
                      href={v.iconUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                      title="Mở icon"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm">-</span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="font-medium text-slate-900">{v.name}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">
                    {v.description}
                  </div>
                </TableCell>

                <TableCell className="font-mono text-sm text-slate-700">
                  {v.code}
                </TableCell>

                <TableCell className="space-x-2">
                  {v.requiresOdometerTracking ? (
                    <Badge className="bg-slate-900 text-white">ODO</Badge>
                  ) : null}
                  {v.requiresTimeTracking ? (
                    <Badge
                      variant="outline"
                      className="border-red-200 text-red-600"
                    >
                      TIME
                    </Badge>
                  ) : null}
                  {!v.requiresOdometerTracking && !v.requiresTimeTracking ? (
                    <span className="text-sm text-slate-400">-</span>
                  ) : null}
                </TableCell>

                <TableCell className="text-sm text-slate-700">
                  {v.displayOrder}
                </TableCell>

                <TableCell className="text-sm text-slate-600">
                  {created}
                </TableCell>

                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-200"
                      onClick={() => onEdit(v)}
                      disabled={disabled}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Sửa
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:text-red-700"
                      onClick={() => onDelete(v)}
                      disabled={disabled || isDeletingId === v.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeletingId === v.id ? "Đang xóa..." : "Xóa"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
