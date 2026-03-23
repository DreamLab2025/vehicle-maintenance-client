import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortDescending: boolean;
  onSortChange: (desc: boolean) => void;
  isLoading: boolean;
}

export default function VehicleTypeToolbar({
  searchTerm,
  onSearchChange,
  sortDescending,
  onSortChange,
  isLoading,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
      <Input
        placeholder="Tìm kiếm theo tên loại xe..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
        disabled={isLoading}
      />

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => onSortChange(!sortDescending)} disabled={isLoading}>
          <ArrowDownUp className="mr-2 h-4 w-4" />
          {sortDescending ? "Mới nhất trước" : "Cũ nhất trước"}
        </Button>
      </div>
    </div>
  );
}
