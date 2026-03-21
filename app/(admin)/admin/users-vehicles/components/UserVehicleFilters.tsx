"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  keyword: string;
  onKeywordChange: (v: string) => void;

  isDescending: boolean;
  onIsDescendingChange: (v: boolean) => void;
};

export default function UserVehicleFilters({ keyword, onKeywordChange, isDescending, onIsDescendingChange }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-[420px]">
        <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-60" />
        <Input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Tìm theo nickname, biển số, model, màu..."
          className="pl-9"
        />
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <Select value={isDescending ? "desc" : "asc"} onValueChange={(v) => onIsDescendingChange(v === "desc")}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black shadow-md">
            <SelectItem value="desc">Mới nhất trước</SelectItem>
            <SelectItem value="asc">Cũ nhất trước</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => onKeywordChange("")} className="w-full sm:w-auto">
          Xoá lọc
        </Button>
      </div>
    </div>
  );
}
