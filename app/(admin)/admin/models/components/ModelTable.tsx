"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { VehicleModel } from "@/lib/api/services/fetchModel";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { useDeleteModel } from "@/hooks/useModel";

interface ModelTableProps {
  models: VehicleModel[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onRefresh: () => void;
}

export function ModelTable({ models, isLoading, onEdit, onRefresh }: ModelTableProps) {
  const deleteModel = useDeleteModel();

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteModel.mutateAsync(id);
      if (result.isSuccess) {
        toast.success(result.message || "Xóa mẫu xe thành công");
        onRefresh();
      } else {
        toast.error(result.message || "Xóa mẫu xe thất bại");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa mẫu xe";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!models || models.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-100 rounded-xl bg-white shadow-sm">
        <p className="text-gray-500">Không có dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/60">
          <TableRow className="border-gray-100">
            <TableHead className="text-gray-700">Tên mẫu xe</TableHead>
            <TableHead className="text-gray-700">Thương hiệu</TableHead>
            <TableHead className="text-gray-700">Loại xe</TableHead>
            <TableHead className="text-gray-700">Năm SX</TableHead>
            <TableHead className="text-gray-700">Hộp số</TableHead>
            <TableHead className="text-gray-700">Nhiên liệu</TableHead>
            <TableHead className="text-gray-700">Dung tích</TableHead>
            <TableHead className="text-gray-700">Màu sắc</TableHead>
            <TableHead className="text-right text-gray-700">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id} className="border-gray-100">
              <TableCell className="font-medium text-gray-900">{model.name}</TableCell>
              <TableCell className="text-gray-700">{model.brandName}</TableCell>
              <TableCell className="text-gray-700">{model.typeName}</TableCell>
              <TableCell className="text-gray-700">{model.releaseYear}</TableCell>
              <TableCell className="text-gray-700">{model.transmissionTypeName}</TableCell>
              <TableCell className="text-gray-700">{model.fuelTypeName}</TableCell>
              <TableCell className="text-gray-700">{model.engineDisplacementDisplay}</TableCell>

              {/* <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {model.variants?.slice(0, 3).map((variant) => (
                    <Badge key={variant.id} variant="outline" className="border-gray-200 text-gray-700 bg-white">
                      {variant.color}
                    </Badge>
                  ))}
                  {model.variants?.length > 3 && (
                    <Badge className="bg-red-50 text-red-700 border border-red-200">+{model.variants.length - 3}</Badge>
                  )}
                </div>
              </TableCell> */}
              {/* TODO: Add variants table cell */}

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(model.id)}
                    className="border-gray-200 bg-white hover:bg-red-50 hover:text-red-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="border-gray-200 bg-white hover:bg-red-50">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="bg-white text-gray-900 border border-gray-200 shadow-xl z-[70]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900">Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                          Bạn có chắc chắn muốn xóa mẫu xe <strong className="text-gray-900">{model.name}</strong>? Hành
                          động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-200 bg-white hover:bg-gray-50">Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(model.id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
