"use client";

import * as React from "react";

import type { UserVehicleQueryParams } from "@/lib/api/services/fetchUserVehicle";
import { useUserVehicles } from "@/hooks/useUserVehice";
import UserVehicleToolbar from "./components/UserVehicleToolbar";
import UserVehicleFilters from "./components/UserVehicleFilters";
import UserVehicleTable from "./components/UserVehicleTable";
import UserVehiclePagination from "./components/UserVehiclePagination";

export default function UserVehiclepage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [keyword, setKeyword] = React.useState("");
  const [isDescending, setIsDescending] = React.useState(true);

  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const params = React.useMemo<UserVehicleQueryParams>(
    () => ({
      PageNumber: pageNumber,
      PageSize: pageSize,
      IsDescending: isDescending,
    }),
    [pageNumber, pageSize, isDescending],
  );

  const { vehicles, metadata, isLoading, isFetching, isError, error, refetch } = useUserVehicles(params, true);

  const filtered = React.useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return vehicles;

    return vehicles.filter((v) => {
      const model = v.variant?.model;
      const haystack = [
        v.nickname,
        v.licensePlate,
        v.vinNumber,
        v.variant?.color,
        model?.name,
        model?.brandName,
        model?.typeName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(k);
    });
  }, [vehicles, keyword]);

  // Nếu đổi sort/pageSize thì quay về page 1 cho hợp lý
  React.useEffect(() => {
    setPageNumber(1);
  }, [pageSize, isDescending]);

  return (
    <div className="flex flex-1 flex-col gap-5 p-6">
      <UserVehicleToolbar onAddClick={() => setDialogOpen(true)} onRefresh={() => refetch()} isFetching={isFetching} />

      <UserVehicleFilters
        keyword={keyword}
        onKeywordChange={setKeyword}
        isDescending={isDescending}
        onIsDescendingChange={setIsDescending}
      />

      {isError ? (
        <div className="rounded-xl border p-4 text-sm">
          <div className="font-medium">Không tải được danh sách xe</div>
        </div>
      ) : null}

      <UserVehicleTable vehicles={filtered} isLoading={isLoading} />
      <UserVehiclePagination
        metadata={metadata}
        pageNumber={pageNumber}
        pageSize={pageSize}
        onPageChange={setPageNumber}
        onPageSizeChange={setPageSize}
        isFetching={isFetching}
      />
    </div>
  );
}
