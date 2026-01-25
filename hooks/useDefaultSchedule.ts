import { useQuery } from "@tanstack/react-query";
import DefaultScheduleService, {
  DefaultScheduleListResponse,
  DefaultSchedule,
} from "@/lib/api/services/fetchDefaultSchedule";

type UseDefaultSchedulesSelected = {
  schedules: DefaultSchedule[];
  message: DefaultScheduleListResponse["message"];
  isSuccess: DefaultScheduleListResponse["isSuccess"];
};

export function useDefaultSchedules(
  vehicleModelId: string | undefined,
  enabled: boolean = true
) {
  const query = useQuery<DefaultScheduleListResponse, Error, UseDefaultSchedulesSelected>({
    queryKey: ["default-schedules", "vehicle-model", vehicleModelId],
    queryFn: () => DefaultScheduleService.getDefaultSchedules(vehicleModelId!),
    enabled: enabled && !!vehicleModelId,
    select: (data) => ({
      schedules: data.data ?? [],
      message: data.message,
      isSuccess: data.isSuccess,
    }),
    staleTime: 60_000, // 1 minute
  });

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,

    schedules: query.data?.schedules ?? [],
    message: query.data?.message,
    isSuccess: query.data?.isSuccess,
  };
}
