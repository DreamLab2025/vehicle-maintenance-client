"use client";

import { Brand } from "@/lib/api/services/fetchBrand";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Globe, Phone, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  data: Brand[];
  isLoading?: boolean;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export function BrandTable({ data, isLoading, onEdit, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="h-12 bg-slate-50 animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b border-slate-50 animate-pulse bg-white/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="font-bold text-slate-700">Thương hiệu</TableHead>
            <TableHead className="font-bold text-slate-700">Loại xe hỗ trợ</TableHead>
            <TableHead className="font-bold text-slate-700">Thông tin liên hệ</TableHead>
            <TableHead className="text-right font-bold text-slate-700 px-6">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            data.map((brand) => {
              const hasVehicleTypes = brand.vehicleTypeNames && brand.vehicleTypeNames.length > 0;

              return (
                <TableRow key={brand.id} className="group hover:bg-red-50/30 transition-colors">
                  {/* Name */}
                  <TableCell className="font-semibold text-slate-900">{brand.name}</TableCell>

                  {/* Vehicle types */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {hasVehicleTypes ? (
                        brand.vehicleTypeNames.map((name, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600">
                            {name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs italic text-slate-400">Chưa gán loại xe</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <div className="space-y-1">
                      {brand.website && (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600"
                        >
                          <Globe className="w-3 h-3" />
                          {brand.website.replace(/(^\w+:|^)\/\//, "")}
                        </a>
                      )}
                      {brand.supportPhone && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Phone className="w-3 h-3" />
                          {brand.supportPhone}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Edit */}
                      <Button size="icon" variant="ghost" onClick={() => onEdit(brand)}>
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Delete (FE blocked if has vehicle types) */}
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={hasVehicleTypes}
                        title={hasVehicleTypes ? "Không thể xoá vì đang gán loại xe" : "Xoá thương hiệu"}
                        onClick={() => {
                          if (hasVehicleTypes) return;
                          onDelete(brand);
                        }}
                      >
                        <Trash2 className={cn("h-4 w-4", hasVehicleTypes ? "text-slate-300" : "text-red-600")} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center italic text-slate-400">
                Chưa có thương hiệu nào được tạo
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
