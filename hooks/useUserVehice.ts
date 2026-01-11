import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UserVehicleService, {
  CreateUserVehicleRequest,
  CreateUserVehicleResponse,
  UserVehicleListResponse,
  UserVehicleQueryParams,
} from "@/lib/api/services/fetchUserVehicle";

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
