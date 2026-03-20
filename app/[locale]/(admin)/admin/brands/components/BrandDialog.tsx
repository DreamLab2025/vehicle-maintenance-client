"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCreateBrand } from "@/hooks/useBrand";
import { Building2, Save, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * ⚠️ TẠM THỜI fix cứng Motorcycle
 * Sau này thay bằng select từ API vehicle-types
 */
const MOTORCYCLE_TYPE_ID = "11111111-1111-1111-1111-111111111111";

export function BrandDialog({ open, onOpenChange }: Props) {
  const createBrand = useCreateBrand();

  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [supportPhone, setSupportPhone] = useState("");

  const handleSubmit = async () => {
    try {
      await createBrand.mutateAsync({
        name: name.trim(),
        vehicleTypeIds: [MOTORCYCLE_TYPE_ID],
        logoUrl: logoUrl || undefined,
        website: website || undefined,
        supportPhone: supportPhone || undefined,
      });

      // reset form
      setName("");
      setLogoUrl("");
      setWebsite("");
      setSupportPhone("");

      onOpenChange(false);
    } catch (error) {
      console.error("Create brand error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl bg-white">
        <div className="h-1.5 bg-red-600 w-full" />

        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 rounded-xl">
              <Building2 className="w-6 h-6 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-800">Thêm thương hiệu mới</DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Tên thương hiệu */}
          <div className="space-y-2">
            <Label className="font-bold">
              Tên thương hiệu <span className="text-red-500">*</span>
            </Label>
            <Input placeholder="VD: Honda, Yamaha..." value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <Label className="font-bold">Logo URL</Label>
            <Input placeholder="https://..." value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label className="font-bold">Website</Label>
            <Input placeholder="https://honda.com.vn" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>

          {/* Support phone */}
          <div className="space-y-2">
            <Label className="font-bold">Số điện thoại hỗ trợ</Label>
            <Input placeholder="1900 1234" value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!name || createBrand.isPending}
              className="bg-red-600 hover:bg-red-700 text-white px-6"
            >
              {createBrand.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Lưu thương hiệu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
