import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { VehicleType } from "@/lib/api/services/fetchType";
import { useEffect } from "react";
import { BikeIcon, Plus, Save } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Tên loại xe phải từ 2 ký tự trở lên"),
  description: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: VehicleType | null;
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export default function VehicleTypeDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
  isEditMode,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Đồng bộ dữ liệu khi mở Dialog hoặc đổi initialData
  useEffect(() => {
    if (open) {
      form.reset({
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
      });
    }
  }, [initialData, form, open]);

  const handleFormSubmit = form.handleSubmit((values) => {
    onSubmit(values);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* SỬA LỖI MÀU: 
        - Thêm bg-white để ép nền luôn trắng.
        - Thêm text-slate-900 để chữ luôn đậm màu.
        - Loại bỏ border mặc định hoặc chỉnh border-slate-100.
      */}
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl bg-white text-slate-900">
        {/* Dải màu đỏ trang trí phía trên */}
        <div className="h-1.5 bg-red-600 w-full" />

        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 rounded-xl">
              <BikeIcon className="w-6 h-6 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-800">
              {isEditMode ? "Chỉnh sửa loại xe" : "Thêm loại xe mới"}
            </DialogTitle>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {isEditMode
              ? "Thay đổi thông tin phân loại phương tiện trong hệ thống."
              : "Vui lòng nhập đầy đủ các thông tin có dấu (*) bên dưới."}
          </p>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="px-6 py-6 space-y-6">
          {/* Nhóm: Tên loại xe */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold text-slate-700 flex items-center gap-1">
              Tên loại xe <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="VD: Xe máy, Ô tô tải, Xe điện..."
              className={`h-11 bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-red-500 focus-visible:bg-white transition-all ${
                form.formState.errors.name ? "border-red-400 ring-1 ring-red-400" : ""
              }`}
            />
            {form.formState.errors.name && (
              <p className="text-xs font-medium text-red-500 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Nhóm: Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold text-slate-700">
              Mô tả chi tiết
            </Label>
            <Textarea
              id="description"
              {...form.register("description")}
              rows={4}
              placeholder="Ghi chú thêm về đặc điểm của loại xe này..."
              className="
          bg-slate-50
    border-slate-200
    text-slate-900
    placeholder:not-italic
    placeholder:text-slate-400
    focus-visible:ring-red-500
    focus-visible:bg-white
    transition-all
    resize-none
  "
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-medium px-5"
            >
              Hủy bỏ
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 px-7 h-11 font-semibold transition-all active:scale-95 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  {isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isEditMode ? "Cập nhật" : "Tạo mới ngay"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
