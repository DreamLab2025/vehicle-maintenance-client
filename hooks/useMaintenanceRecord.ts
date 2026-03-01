// src/hooks/useMaintenanceRecord.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import MaintenanceRecordService, {
  CreateMaintenanceRecordRequest,
  ApiResponse,
  MaintenanceRecordResponse,
} from "@/lib/api/services/maintenanceRecord.service";

export function useCreateMaintenanceRecord() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MaintenanceRecordResponse>,
    Error,
    { userVehicleId: string; payload: CreateMaintenanceRecordRequest }
  >({
    mutationFn: ({ userVehicleId, payload }) =>
      MaintenanceRecordService.createMaintenanceRecord(userVehicleId, payload),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["user-vehicle-parts"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-reminders"] });
      toast.success(data.message || "Tạo phiếu bảo dưỡng thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Tạo phiếu bảo dưỡng thất bại!");
    },
  });
}
