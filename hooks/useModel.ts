import { useQuery } from "@tanstack/react-query";
import ModelService, { ModelListResponse, ModelQueryParams } from "@/lib/api/services/fetchModel";

type UseModelsSelected = {
  models: ModelListResponse["data"];
  metadata: ModelListResponse["metadata"];
  message: ModelListResponse["message"];
  isSuccess: ModelListResponse["isSuccess"];
};

export function useModels(params: ModelQueryParams, enabled: boolean = true) {
  const query = useQuery<ModelListResponse, Error, UseModelsSelected>({
    // ✅ params là object => nên normalize để queryKey ổn định hơn
    queryKey: ["models", "list", JSON.stringify(params)],
    queryFn: () => ModelService.getModels(params),
    enabled: enabled && !!params?.PageNumber && !!params?.PageSize,
    select: (data) => ({
      models: data.data ?? [],
      metadata: data.metadata,
      message: data.message,
      isSuccess: data.isSuccess,
    }),
    staleTime: 30_000,
  });

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,

    models: query.data?.models ?? [],
    metadata: query.data?.metadata,
    message: query.data?.message,
    isSuccess: query.data?.isSuccess,
  };
}
