import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar, CarFront, FileText } from "lucide-react";
import type { VehicleType } from "@/lib/api/services/fetchType";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props = {
  data: VehicleType[]; // Nhận vào một mảng thay vì từng object lẻ để tối ưu render bảng
  onEdit: (type: VehicleType) => void;
  onDelete: (id: string) => void;
  isDeletingId?: string | null;
};

export default function VehicleTypeTable({ data, onEdit, onDelete, isDeletingId }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-b border-slate-100">
            <TableHead className="w-[250px] py-4 font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <CarFront className="w-4 h-4 text-red-600" />
                Loại xe
              </div>
            </TableHead>
            <TableHead className="font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Mô tả
              </div>
            </TableHead>
            <TableHead className="w-[180px] font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Ngày tạo
              </div>
            </TableHead>
            <TableHead className="w-[120px] text-right font-bold text-slate-700">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id} className="group hover:bg-red-50/30 transition-colors border-b border-slate-50">
                <TableCell className="font-semibold text-slate-800 py-4">{item.name}</TableCell>
                <TableCell className="text-slate-500 max-w-[400px]">
                  <p className="line-clamp-1 italic text-sm">{item.description || "Chưa có mô tả chi tiết..."}</p>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="text-right py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                      disabled={isDeletingId === item.id}
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      {isDeletingId === item.id ? (
                        <div className="h-4 w-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-slate-400 italic">
                Chưa có dữ liệu loại xe nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
