"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CreateModelRequest, TransmissionType } from "@/lib/api/services/fetchModel";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateModel, useUpdateModel, useModelById } from "@/hooks/useModel";

// Hooks bạn đã có
import { useBrandsByType } from "@/hooks/useBrand";
import { useTypes } from "@/hooks/useType";

interface ModelDialogProps {
  open: boolean;
  onClose: () => void;
  modelId?: string | null;
}

type FormData = CreateModelRequest;

type SelectOption = {
  value: string;
  label: string;
};

// Nếu API bạn khác field, đổi tại đây (KHÔNG dùng any)
type VehicleType = {
  id: string;
  name: string;
};

type Brand = {
  id: string;
  name: string;
};

export function ModelDialog({ open, onClose, modelId }: ModelDialogProps) {
  const isEditMode = !!modelId;
  const [isLoading, setIsLoading] = useState(false);

  const { model, isLoading: isLoadingModel } = useModelById(modelId || "", !!modelId);
  const createModel = useCreateModel();
  const updateModel = useUpdateModel();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      brandId: "",
      typeId: "",
      releaseYear: new Date().getFullYear(),
      fuelType: "Gasoline",
      transmissionType: "Manual",
      engineDisplacement: 0,
      engineCapacity: 0,
      oilCapacity: 0,
      tireSizeFront: "",
      tireSizeRear: "",
      images: [{ color: "", hexCode: "#000000", imageUrl: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const typeId = watch("typeId");
  const brandId = watch("brandId");

  // Types dropdown
  const { types, isLoading: isLoadingTypes } = useTypes({ PageNumber: 1, PageSize: 100 });

  // Brands dropdown depends on typeId
  const { brands, isLoading: isLoadingBrands } = useBrandsByType(typeId, true);

  const typeOptions: SelectOption[] = useMemo(() => {
    // Ép kiểu từ hook về shape mong muốn (không any)
    const list = (types as unknown as VehicleType[]) ?? [];
    return list.map((t) => ({ value: t.id, label: t.name }));
  }, [types]);

  const brandOptions: SelectOption[] = useMemo(() => {
    const list = (brands as unknown as Brand[]) ?? [];
    return list.map((b) => ({ value: b.id, label: b.name }));
  }, [brands]);

  useEffect(() => {
    if (isEditMode && model) {
      reset({
        name: model.name,
        brandId: model.brandId,
        typeId: model.typeId,
        releaseYear: model.releaseYear,
        fuelType: String(model.fuelType),
        transmissionType: String(model.transmissionType),
        engineDisplacement: Number(model.engineDisplacementDisplay?.replace(" cc", "")) || 0,
        engineCapacity: model.engineCapacity || 0,
        oilCapacity: model.oilCapacity || 0,
        tireSizeFront: model.tireSizeFront || "",
        tireSizeRear: model.tireSizeRear || "",
        images:
          model.variants?.map((v) => ({
            color: v.color,
            hexCode: v.hexCode,
            imageUrl: v.imageUrl,
          })) || [],
      });
    } else if (!isEditMode) {
      reset({
        name: "",
        brandId: "",
        typeId: "",
        releaseYear: new Date().getFullYear(),
        fuelType: "Gasoline",
        transmissionType: "Manual",
        engineDisplacement: 0,
        engineCapacity: 0,
        oilCapacity: 0,
        tireSizeFront: "",
        tireSizeRear: "",
        images: [{ color: "", hexCode: "#000000", imageUrl: "" }],
      });
    }
  }, [model, isEditMode, reset]);

  // Khi đổi Type => clear Brand để tránh mismatch
  useEffect(() => {
    if (typeId) {
      setValue("brandId", "", { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeId]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (isEditMode && modelId) {
        const result = await updateModel.mutateAsync({ id: modelId, data });
        if (result.isSuccess) {
          toast.success(result.message || "Cập nhật mẫu xe thành công");
          onClose();
        } else {
          toast.error(result.message || "Cập nhật mẫu xe thất bại");
        }
      } else {
        const result = await createModel.mutateAsync(data);
        if (result.isSuccess) {
          toast.success(result.message || "Tạo mẫu xe thành công");
          onClose();
        } else {
          toast.error(result.message || "Tạo mẫu xe thất bại");
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const transmissionOptions: { value: TransmissionType; label: string }[] = [
    { value: "Manual", label: "Xe số" },
    { value: "Automatic", label: "Tay ga" },
    { value: "Sport", label: "Xe côn" },
    { value: "ManualCar", label: "Số sàn" },
    { value: "AutomaticCar", label: "Số tự động" },
    { value: "Electric", label: "Điện" },
  ];

  const fuelTypeOptions: { value: string; label: string }[] = [
    { value: "Gasoline", label: "Xăng" },
    { value: "Diesel", label: "Dầu" },
    { value: "Electric", label: "Điện" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 border border-gray-200 shadow-xl">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Cập nhật Mẫu Xe" : "Thêm Mẫu Xe Mới"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {isEditMode ? "Chỉnh sửa thông tin mẫu xe" : "Điền thông tin để tạo mẫu xe mới"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingModel && isEditMode ? (
          <div className="flex items-center justify-center py-8 text-red-600">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* giữ validation của react-hook-form cho field Select */}
            <input type="hidden" {...register("typeId", { required: "Type là bắt buộc" })} />
            <input type="hidden" {...register("brandId", { required: "Brand là bắt buộc" })} />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Tên mẫu xe <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name", { required: "Tên mẫu xe là bắt buộc" })}
                  placeholder="Vision, Winner X..."
                  className="bg-white border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>

              {/* Type dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Type <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={typeId || undefined}
                  onValueChange={(value) => setValue("typeId", value, { shouldValidate: true })}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-red-500 focus:border-red-500">
                    <SelectValue placeholder={isLoadingTypes ? "Đang tải..." : "Chọn loại xe"} />
                  </SelectTrigger>
                  <SelectContent className="z-[60] bg-white text-gray-900 border border-gray-200 shadow-lg">
                    {typeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="focus:bg-red-50">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.typeId && <p className="text-sm text-red-600">{String(errors.typeId.message)}</p>}
              </div>

              {/* Brand dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Brand <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={brandId || undefined}
                  onValueChange={(value) => setValue("brandId", value, { shouldValidate: true })}
                  disabled={!typeId}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-red-500 focus:border-red-500 disabled:opacity-60">
                    <SelectValue
                      placeholder={!typeId ? "Chọn Type trước" : isLoadingBrands ? "Đang tải..." : "Chọn thương hiệu"}
                    />
                  </SelectTrigger>
                  <SelectContent className="z-[60] bg-white text-gray-900 border border-gray-200 shadow-lg">
                    {brandOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="focus:bg-red-50">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brandId && <p className="text-sm text-red-600">{String(errors.brandId.message)}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="releaseYear" className="text-sm font-medium text-gray-700">
                  Năm sản xuất
                </Label>
                <Input
                  id="releaseYear"
                  type="number"
                  {...register("releaseYear", { valueAsNumber: true })}
                  className="bg-white border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType" className="text-sm font-medium text-gray-700">
                  Loại nhiên liệu
                </Label>
                <Select value={watch("fuelType")} onValueChange={(value) => setValue("fuelType", value)}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-red-500 focus:border-red-500">
                    <SelectValue placeholder="Chọn nhiên liệu" />
                  </SelectTrigger>
                  <SelectContent className="z-[60] bg-white text-gray-900 border border-gray-200 shadow-lg">
                    {fuelTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="focus:bg-red-50">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmissionType" className="text-sm font-medium text-gray-700">
                  Loại hộp số
                </Label>
                <Select
                  value={watch("transmissionType")}
                  onValueChange={(value) => setValue("transmissionType", value)}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-red-500 focus:border-red-500">
                    <SelectValue placeholder="Chọn hộp số" />
                  </SelectTrigger>
                  <SelectContent className="z-[60] bg-white text-gray-900 border border-gray-200 shadow-lg">
                    {transmissionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="focus:bg-red-50">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="engineDisplacement" className="text-sm font-medium text-gray-700">
                  Dung tích xy-lanh (cc)
                </Label>
                <Input
                  id="engineDisplacement"
                  type="number"
                  {...register("engineDisplacement", { valueAsNumber: true })}
                  className="bg-white border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engineCapacity" className="text-sm font-medium text-gray-700">
                  Dung tích động cơ (L)
                </Label>
                <Input
                  id="engineCapacity"
                  type="number"
                  step="0.1"
                  {...register("engineCapacity", { valueAsNumber: true })}
                  className="bg-white border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oilCapacity" className="text-sm font-medium text-gray-700">
                  Dung tích nhớt (L)
                </Label>
                <Input
                  id="oilCapacity"
                  type="number"
                  step="0.1"
                  {...register("oilCapacity", { valueAsNumber: true })}
                  className="bg-white border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tireSizeFront" className="text-sm font-medium text-gray-700">
                  Kích thước lốp trước
                </Label>
                <Input
                  id="tireSizeFront"
                  {...register("tireSizeFront")}
                  placeholder="80/90-17"
                  className="bg-white border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tireSizeRear" className="text-sm font-medium text-gray-700">
                  Kích thước lốp sau
                </Label>
                <Input
                  id="tireSizeRear"
                  {...register("tireSizeRear")}
                  placeholder="90/90-17"
                  className="bg-white border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-900">Màu sắc & Hình ảnh</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ color: "", hexCode: "#000000", imageUrl: "" })}
                  className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm màu
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="border-gray-100 shadow-sm bg-white">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Màu sắc</Label>
                        <Input
                          {...register(`images.${index}.color`)}
                          placeholder="Red, Blue..."
                          className="bg-white border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Mã màu (Hex)</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            {...register(`images.${index}.hexCode`)}
                            className="w-16 h-10 p-1 border-gray-200 bg-white"
                          />
                          <Input
                            {...register(`images.${index}.hexCode`)}
                            placeholder="#000000"
                            className="bg-white border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">URL hình ảnh</Label>
                        <div className="flex gap-2">
                          <Input
                            {...register(`images.${index}.imageUrl`)}
                            placeholder="https://..."
                            className="bg-white border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                          />
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => remove(index)}
                              className="border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <DialogFooter className="border-t border-gray-100 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="border-gray-200 hover:bg-gray-50">
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
