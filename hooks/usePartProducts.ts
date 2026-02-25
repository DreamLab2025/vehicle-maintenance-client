import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PartProductService, {
  CreatePartProductRequest,
  PartProduct,
  UpdatePartProductRequest,
  ApiItemResponse,
  ApiListResponse,
} from "@/lib/api/services/fetchPartProducts";

type UseProductsSelected = {
  products: PartProduct[];
  message: string;
  isSuccess: boolean;
};

export function useProductsByCategory(categoryId: string, enabled = true) {
  const query = useQuery<ApiListResponse<PartProduct>, Error, UseProductsSelected>({
    queryKey: ["part-products", "by-category", categoryId],
    queryFn: () => PartProductService.getProductsByCategory(categoryId),
    enabled: enabled && !!categoryId,
    select: (data) => ({
      products: data.data ?? [],
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
    products: query.data?.products ?? [],
    message: query.data?.message,
    isSuccess: query.data?.isSuccess,
  };
}

export function useProductById(id: string, enabled = true) {
  const query = useQuery<ApiItemResponse<PartProduct>, Error>({
    queryKey: ["part-products", "detail", id],
    queryFn: () => PartProductService.getProductById(id),
    enabled: enabled && !!id,
    staleTime: 30_000,
  });

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    product: query.data?.data,
    message: query.data?.message,
    isSuccess: query.data?.isSuccess,
  };
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePartProductRequest) => PartProductService.createProduct(payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["part-products", "by-category", variables.partCategoryId] });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; payload: UpdatePartProductRequest }) =>
      PartProductService.updateProduct(args.id, args.payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["part-products", "detail", variables.id] });
      qc.invalidateQueries({ queryKey: ["part-products", "by-category", variables.payload.partCategoryId] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; categoryId: string }) => PartProductService.deleteProduct(args.id),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["part-products", "by-category", variables.categoryId] });
    },
  });
}
