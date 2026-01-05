"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useMemo, useState } from "react";
import type {
  ModelQueryParams,
  VehicleModel,
} from "@/lib/api/services/fetchModel";
import { useModels } from "@/hooks/useModel";

interface StepFourProps {
  typeId: string;
  brandId: string;
  onSelect: (modelId: string) => void;
}

export function StepFourModel({ typeId, brandId, onSelect }: StepFourProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Search params build từ props + UI input
  const params: ModelQueryParams = useMemo(
    () => ({
      TypeId: typeId,
      BrandId: brandId,
      PageNumber: 1,
      PageSize: 50,
      IsDescending: false,
    }),
    [typeId, brandId, searchTerm]
  );

  const { models, isLoading, isError } = useModels(
    params,
    !!typeId && !!brandId
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Chọn mẫu xe</h1>
        <p className="text-muted-foreground">Chọn mẫu xe của bạn</p>
      </div>

      <Input
        placeholder="Tìm kiếm mẫu xe..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {isLoading && (
        <p className="text-sm text-foreground/60">Đang tải mẫu xe...</p>
      )}
      {isError && (
        <p className="text-sm text-red-500">Không tải được mẫu xe.</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {models.map((model: VehicleModel) => (
          <Card
            key={model.id}
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelect(model.id)}
          >
            <button className="w-full flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white/70">
                {model.imageUrl ? (
                  <Image
                    src={model.imageUrl}
                    alt={model.name}
                    fill
                    className="object-contain p-1"
                    sizes="48px"
                  />
                ) : null}
              </div>

              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">{model.name}</p>
                <p className="text-xs text-foreground/45">
                  {model.engineDisplacementDisplay} •{" "}
                  {model.transmissionTypeName}
                </p>
              </div>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
