import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import UserVehicleService, {
  CreateUserVehicleRequest,
  CreateUserVehicleResponse,
  UserVehicleListResponse,
  UserVehicleQueryParams,
  DeleteUserVehicleResponse,
  UserVehiclePartsResponse,
  AnalyzeQuestionnaireRequest,
  ApplyTrackingRequest,
  VehicleRemindersResponse,
  UpdateOdometerRequest,
} from "@/lib/api/services/fetchUserVehicle";
import type {
  OdometerHistoryQueryParams,
  OdometerHistoryResponse,
} from "@/lib/types/vehicle.types";

export function useCreateUserVehicle() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, data, isPending, isError, error, reset } = useMutation({
    mutationKey: ["user-vehicles"],
    mutationFn: (payload: CreateUserVehicleRequest) => UserVehicleService.createUserVehicle(payload),
    onSuccess: (_data: CreateUserVehicleResponse) => {
      queryClient.invalidateQueries({ queryKey: ["user-vehicles"] });
    },
  });

  return {
    mutate,
    mutateAsync,
    reset,
    isLoading: isPending,
    isError,
    error,
    isSuccess: data?.isSuccess,
    message: data?.message,
    vehicle: data?.data,
    metadata: data?.metadata,
    data,
  };
}

export function useDeleteUserVehicle() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationKey: ["delete-user-vehicle"],
    mutationFn: (id: string) => UserVehicleService.deleteUserVehicle(id),
    onSuccess: (data: DeleteUserVehicleResponse) => {
      queryClient.invalidateQueries({ queryKey: ["user-vehicles"] });
      toast.success(data.message || "Xóa xe thành công!");
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Xóa xe thất bại!");
    },
  });

  return {
    deleteVehicle: mutate,
    deleteVehicleAsync: mutateAsync,
    isDeleting: isPending,
    isError,
    error,
  };
}

export function useUserVehicles(params: UserVehicleQueryParams, enabled: boolean = true) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["user-vehicles", "list", params],
    queryFn: () => UserVehicleService.getUserVehicles(params),
    enabled,
    select: (data: UserVehicleListResponse) => ({
      vehicles: data.data ?? [],
      metadata: data.metadata,
      message: data.message,
      isSuccess: data.isSuccess,
    }),
  });

  return {
    refetch,
    isLoading,
    isFetching,
    isError,
    error,

    vehicles: data?.vehicles ?? [],
    metadata: data?.metadata,
    message: data?.message,
    isSuccess: data?.isSuccess,
  };
}

export function useUserVehicleParts(userVehicleId: string, enabled: boolean = true) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["user-vehicle-parts", userVehicleId],
    queryFn: () => UserVehicleService.getUserVehicleParts(userVehicleId),
    enabled: enabled && !!userVehicleId,
    select: (data: UserVehiclePartsResponse) => ({
      parts: data.data ?? [],
      message: data.message,
      isSuccess: data.isSuccess,
    }),
  });

  return {
    refetch,
    isLoading,
    isFetching,
    isError,
    error,
    parts: data?.parts ?? [],
    message: data?.message,
    isSuccess: data?.isSuccess,
  };
}

export function useAnalyzeQuestionnaire() {
  const { mutate, mutateAsync, data, isPending, isError, error, reset } = useMutation({
    mutationKey: ["analyze-questionnaire"],
    mutationFn: (payload: AnalyzeQuestionnaireRequest) => UserVehicleService.analyzeQuestionnaire(payload),
    onError: (err: Error) => {
      toast.error(err?.message || "Phân tích thất bại!");
    },
  });

  return {
    analyze: mutate,
    analyzeAsync: mutateAsync,
    reset,
    isAnalyzing: isPending,
    isError,
    error,
    data: data?.data,
    recommendations: data?.data?.recommendations ?? [],
    warnings: data?.data?.warnings ?? [],
    isSuccess: data?.isSuccess,
    message: data?.message,
  };
}

export function useApplyTracking() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, data, isPending, isError, error, reset } = useMutation({
    mutationKey: ["apply-tracking"],
    mutationFn: ({ userVehicleId, payload }: { userVehicleId: string; payload: ApplyTrackingRequest }) =>
      UserVehicleService.applyTracking(userVehicleId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-vehicle-parts"] });
      toast.success(data.message || "Áp dụng cấu hình thành công!");
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Áp dụng cấu hình thất bại!");
    },
  });

  return {
    apply: mutate,
    applyAsync: mutateAsync,
    reset,
    isApplying: isPending,
    isError,
    error,
    data: data?.data,
    isSuccess: data?.isSuccess,
    message: data?.message,
  };
}

export function useUserVehicleReminders(userVehicleId: string, enabled: boolean = true) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["user-vehicle-reminders", userVehicleId],
    queryFn: () => UserVehicleService.getReminders(userVehicleId),
    enabled: enabled && !!userVehicleId,
    select: (data: VehicleRemindersResponse) => ({
      reminders: data.data ?? [],
      message: data.message,
      isSuccess: data.isSuccess,
    }),
  });

  return {
    refetch,
    isLoading,
    isFetching,
    isError,
    error,
    reminders: data?.reminders ?? [],
    message: data?.message,
    isSuccess: data?.isSuccess,
  };
}

export function useUpdateOdometer() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, data, isPending, isError, error, reset } = useMutation({
    mutationKey: ["update-odometer"],
    mutationFn: ({ userVehicleId, payload }: { userVehicleId: string; payload: UpdateOdometerRequest }) =>
      UserVehicleService.updateOdometer(userVehicleId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-vehicles"] });
      toast.success(data.message || "Cập nhật số km thành công!");
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Cập nhật số km thất bại!");
    },
  });

  return {
    updateOdometer: mutate,
    updateOdometerAsync: mutateAsync,
    reset,
    isUpdating: isPending,
    isError,
    error,
    vehicle: data?.data,
    isSuccess: data?.isSuccess,
    message: data?.message,
  };
}

export function useOdometerHistory(
  userVehicleId: string | undefined,
  params: OdometerHistoryQueryParams,
  enabled: boolean = true
) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["user-vehicle", "odometer-history", userVehicleId, params],
    queryFn: () => UserVehicleService.getOdometerHistory(userVehicleId!, params),
    enabled: enabled && !!userVehicleId,
    select: (data: OdometerHistoryResponse) => ({
      history: data.data ?? [],
      metadata: data.metadata,
      message: data.message,
      isSuccess: data.isSuccess,
    }),
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    staleTime: 0, // Always consider data stale to ensure fresh fetch
  });

  return {
    refetch,
    isLoading,
    isFetching,
    isError,
    error,
    history: data?.history ?? [],
    metadata: data?.metadata,
    message: data?.message,
    isSuccess: data?.isSuccess,
  };
}

export function useScanOdometer() {
  const { mutate, mutateAsync, data, isPending, isError, error, reset } = useMutation({
    mutationKey: ["scan-odometer"],
    mutationFn: (image: File) => UserVehicleService.scanOdometer(image),
    onError: (err: Error) => {
      toast.error(err?.message || "Nhận diện ODO thất bại!");
    },
  });

  return {
    scan: mutate,
    scanAsync: mutateAsync,
    reset,
    isScanning: isPending,
    isError,
    error,
    scanResult: data?.data,
    isSuccess: data?.isSuccess,
    message: data?.message,
  };
}
