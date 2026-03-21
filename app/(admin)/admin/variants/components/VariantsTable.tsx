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
import type { VehicleVariant } from "@/lib/api/services/fetchVariants";

type Props = {
  data: VehicleVariant[];
  onEdit: (v: VehicleVariant) => void;
  onDelete: (v: VehicleVariant) => void; // ✅ đổi
  isDeletingId: string | null;
  disabled?: boolean;
};

function isValidHex(hex: string) {
  const h = (hex || "").trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h);
}

export default function VariantsTable({
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
            <TableHead className="w-[120px]">Màu</TableHead>
            <TableHead>Tên màu</TableHead>
            <TableHead className="w-[160px]">Hex</TableHead>
            <TableHead>Ảnh</TableHead>
            <TableHead className="w-[190px]">Tạo lúc</TableHead>
            <TableHead className="w-[150px] text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((v) => {
            const okHex = isValidHex(v.hexCode);
            const created = v.createdAt
              ? new Date(v.createdAt).toLocaleString()
              : "-";

            return (
              <TableRow key={v.id} className="hover:bg-slate-50/60">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-lg border border-slate-200 shadow-sm"
                      style={{ backgroundColor: okHex ? v.hexCode : "#ffffff" }}
                      title={okHex ? v.hexCode : "Hex không hợp lệ"}
                    />
                    {!okHex ? (
                      <Badge variant="destructive">Hex lỗi</Badge>
                    ) : null}
                  </div>
                </TableCell>

                <TableCell className="font-medium text-slate-900">
                  {v.color}
                </TableCell>

                <TableCell className="font-mono text-sm text-slate-700">
                  {v.hexCode}
                </TableCell>

                <TableCell>
                  {v.imageUrl ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={v.imageUrl}
                        alt={v.color}
                        className="h-10 w-16 rounded-md object-cover border border-slate-200 bg-slate-50"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <a
                        href={v.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                      >
                        Mở ảnh <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">Không có</span>
                  )}
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
                      onClick={() => onDelete(v)} // ✅ đổi
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
