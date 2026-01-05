import { useQuery } from "@tanstack/react-query";
import ModelService, { ModelListResponse, ModelQueryParams } from "@/lib/api/services/fetchModel";

export function useModels(params: ModelQueryParams, enabled: boolean = true) {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["models", "list", params],
    queryFn: () => ModelService.getModels(params),
    enabled,
    select: (data: ModelListResponse) => ({
      models: data.data ?? [],
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
    models: data?.models ?? [],
    metadata: data?.metadata,
    message: data?.message,
    isSuccess: data?.isSuccess,
  };
}