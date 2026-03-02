// src/hooks/useMaintenanceRecord.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import MaintenanceRecordService, {
  CreateMaintenanceRecordRequest,
  ApiResponse,
  MaintenanceRecordResponse,
  MaintenanceRecordListItem,
  MaintenanceRecordDetail,
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
      queryClient.invalidateQueries({ queryKey: ["maintenance-records"] });
      toast.success(data.message || "Tạo phiếu bảo dưỡng thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Tạo phiếu bảo dưỡng thất bại!");
    },
  });
}

/**
 * Hook để lấy danh sách phiếu bảo dưỡng theo xe
 */
export function useMaintenanceRecordsByVehicle(
  userVehicleId: string | null | undefined,
  enabled: boolean = true
) {
  return useQuery<ApiResponse<MaintenanceRecordListItem[]>, Error>({
    queryKey: ["maintenance-records", "vehicle", userVehicleId],
    queryFn: () => MaintenanceRecordService.getMaintenanceRecordsByVehicle(userVehicleId!),
    enabled: enabled && !!userVehicleId,
    select: (data) => data,
  });
}

/**
 * Hook để lấy chi tiết phiếu bảo dưỡng
 */
export function useMaintenanceRecordById(
  maintenanceRecordId: string | null | undefined,
  enabled: boolean = true
) {
  return useQuery<ApiResponse<MaintenanceRecordDetail>, Error>({
    queryKey: ["maintenance-records", "detail", maintenanceRecordId],
    queryFn: () => MaintenanceRecordService.getMaintenanceRecordById(maintenanceRecordId!),
    enabled: enabled && !!maintenanceRecordId,
    select: (data) => data,
  });
}
