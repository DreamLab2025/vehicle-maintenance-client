"use client";

import { Brand } from "@/lib/api/services/fetchBrand";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useUpdateBrand } from "@/hooks/useBrand";
import { Loader2, Save, Building2, Globe, Phone, ImageIcon } from "lucide-react";

interface Props {
  open: boolean;
  brand: Brand | null;
  onClose: () => void;
}

export function BrandEditDialog({ open, brand, onClose }: Props) {
  const updateBrand = useUpdateBrand();

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [supportPhone, setSupportPhone] = useState("");

  // Preload data khi brand thay đổi
  useEffect(() => {
    if (brand) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(brand.name || "");
      setWebsite(brand.website ?? "");
      setLogoUrl(brand.logoUrl ?? "");
      setSupportPhone(brand.supportPhone ?? "");
    }
  }, [brand]);

  const handleSubmit = async () => {
    if (!brand) return;

    await updateBrand.mutateAsync({
      id: brand.id,
      payload: {
        name,
        ...(website && { website }),
        ...(logoUrl && { logoUrl }),
        ...(supportPhone && { supportPhone }),
      },
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* FIX LỖI MÀU ĐEN: 
        - Thêm bg-white text-slate-900 để ép màu sáng.
        - Border-none và shadow-2xl để tạo cảm giác hiện đại.
      */}
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl bg-white text-slate-900">
        {/* Thanh accent màu đỏ trang trí trên cùng */}
        <div className="h-1.5 bg-red-600 w-full" />

        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 rounded-xl">
              <Building2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800">Cập nhật thương hiệu</DialogTitle>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                ID: {brand?.id.slice(0, 8)}...
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Tên thương hiệu */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              Tên thương hiệu <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Toyota, Hyundai..."
              className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-red-500 focus-visible:bg-white transition-all"
            />
          </div>

          {/* Grid cho các thông tin phụ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> Website
              </Label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="bg-slate-50 border-slate-200 focus-visible:ring-red-500 focus-visible:bg-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> SĐT hỗ trợ
              </Label>
              <Input
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="090..."
                className="bg-slate-50 border-slate-200 focus-visible:ring-red-500 focus-visible:bg-white transition-all"
              />
            </div>
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Link ảnh Logo
            </Label>
            <Input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="Link hình ảnh (.png, .jpg)..."
              className="bg-slate-50 border-slate-200 focus-visible:ring-red-500 focus-visible:bg-white transition-all"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={updateBrand.isPending}
              className="text-slate-500 hover:bg-slate-100 font-medium"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updateBrand.isPending || !name}
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200/50 px-8 h-11 font-semibold transition-all active:scale-95"
            >
              {updateBrand.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {updateBrand.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
