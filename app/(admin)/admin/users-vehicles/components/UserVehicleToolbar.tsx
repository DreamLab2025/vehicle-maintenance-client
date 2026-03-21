"use client";

import * as React from "react";
import { Plus, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  onAddClick: () => void;
  onRefresh: () => void;
  isFetching?: boolean;
};

export default function UserVehicleToolbar({ onRefresh, isFetching }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-xl font-semibold">User Vehicles</div>
        <div className="text-sm opacity-70">Quản lý danh sách xe của người dùng</div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button variant="outline" onClick={onRefresh} disabled={isFetching}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>
    </div>
  );
}
