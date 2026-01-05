import { BrandQueryParams } from "@/lib/api/services/fetchBrand";
import { useQuery } from "@tanstack/react-query";
import { BrandService } from "@/lib/api/services/fetchBrand";

export function useBrands(
  params: BrandQueryParams,
  enabled: boolean = true
) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["brands", "list", params],
    queryFn: () => BrandService.getBrands(params),
    enabled,
    select: data => ({
      brands: data.data ?? [],
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

    // data
    brands: data?.brands ?? [],
    metadata: data?.metadata,
    message: data?.message,
    isSuccess: data?.isSuccess,
  };
}