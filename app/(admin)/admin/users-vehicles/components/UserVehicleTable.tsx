"use client";

import * as React from "react";
import { Loader2, Trash2 } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { UserVehicle } from "@/lib/api/services/fetchUserVehicle";
import { useDeleteUserVehicle } from "@/hooks/useUserVehice";

type Props = {
  vehicles: UserVehicle[];
  isLoading?: boolean;
};

const fmtDate = (s?: string | null) => {
  if (!s) return "-";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString("vi-VN");
};

const fmtNumber = (n?: number | null) => {
  if (n === null || n === undefined) return "-";
  return new Intl.NumberFormat("vi-VN").format(n);
};

export default function UserVehicleTable({ vehicles, isLoading }: Props) {
  const del = useDeleteUserVehicle();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const onDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await del.deleteVehicleAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nickname</TableHead>
            <TableHead>Biển số</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Màu</TableHead>
            <TableHead className="text-right">Odometer (km)</TableHead>
            <TableHead>Ngày mua</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="py-10 text-center">
                <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                <div className="mt-2 text-sm opacity-70">Đang tải dữ liệu...</div>
              </TableCell>
            </TableRow>
          ) : vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-10 text-center text-sm opacity-70">
                Không có xe nào.
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((v) => {
              const model = v.variant?.model;
              const deleting = deletingId === v.id;

              return (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.nickname || "-"}</TableCell>
                  <TableCell>{v.licensePlate || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{model?.name || "-"}</span>
                      <span className="text-xs opacity-70">
                        {model?.brandName ? model.brandName : "-"}
                        {model?.releaseYear ? ` • ${model.releaseYear}` : ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {v.variant?.color ? (
                      <Badge variant="secondary">{v.variant.color}</Badge>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{fmtNumber(v.currentOdometer)}</TableCell>
                  <TableCell>{fmtDate(v.purchaseDate)}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={deleting}>
                          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xoá xe?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Xe{" "}
                            <span className="font-medium">{v.nickname || v.licensePlate}</span> sẽ bị xoá khỏi hệ thống.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Huỷ</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(v.id)}>Xoá</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
