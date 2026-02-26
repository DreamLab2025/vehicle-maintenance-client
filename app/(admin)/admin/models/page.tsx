"use client";

import { useState } from "react";

import { ModelQueryParams } from "@/lib/api/services/fetchModel";
import { ModelToolbar } from "./components/ModelToolbar";
import { ModelFilters } from "./components/ModelFilters";
import { ModelTable } from "./components/ModelTable";
import { ModelPagination } from "./components/ModelPagination";
import { ModelDialog } from "./components/ModelDialog";
import { useModels } from "@/hooks/useModel";

export default function ModelPage() {
  const [filters, setFilters] = useState<Partial<ModelQueryParams>>({
    PageNumber: 1,
    PageSize: 10,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  const { models, metadata, isLoading, refetch } = useModels(
    filters as ModelQueryParams,
  );

  const handleFilterChange = (newFilters: Partial<ModelQueryParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      PageNumber: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, PageNumber: page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, PageSize: pageSize, PageNumber: 1 }));
  };

  const handleCreate = () => {
    setSelectedModelId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedModelId(id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedModelId(null);
    refetch();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl tracking-tight">Quản lý Mẫu Xe</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách các mẫu xe trong hệ thống
          </p>
        </div>
      </div>

      <div className="flex justify-end p-4">
        <ModelToolbar onCreateClick={handleCreate} />
      </div>

      <ModelFilters filters={filters} onFilterChange={handleFilterChange} />

      <ModelTable
        models={models}
        isLoading={isLoading}
        onEdit={handleEdit}
        onRefresh={refetch}
      />

      {metadata && (
        <ModelPagination
          metadata={metadata}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <ModelDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        modelId={selectedModelId}
      />
    </div>
  );
}
