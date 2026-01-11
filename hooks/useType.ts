import { useQuery } from "@tanstack/react-query";
import TypeService, { TypeListResponse, TypeQueryParams } from "@/lib/api/services/fetchType";

export function useTypes(params: TypeQueryParams, enabled: boolean = true) {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["types", "list", params],
    queryFn: () => TypeService.getTypes(params),
    enabled,
    select: (data: TypeListResponse) => ({
      types: data.data ?? [],
      metadata: data.metadata,
      message: data.message,
      isSuccess: data.isSuccess,
    }),
  });

  return {
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    types: data?.types ?? [],
    metadata: data?.metadata,
    message: data?.message,
    isSuccess: data?.isSuccess,
  };
}
