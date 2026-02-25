// src/hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import UserService, {
  UserDetailResponse,
  UsersListResponse,
  UsersQueryParams,
} from "@/lib/api/services/fetchUsers";

type UseUsersSelected = {
  users: UsersListResponse["data"];
  metadata: UsersListResponse["metadata"];
  message: UsersListResponse["message"];
  isSuccess: UsersListResponse["isSuccess"];
};

function stableUsersKey(params: UsersQueryParams) {
  // đảm bảo queryKey ổn định (tránh object reference)
  return ["users", "list", JSON.stringify(params)] as const;
}

export function useUsers(params: UsersQueryParams, enabled = true) {
  const query = useQuery<UsersListResponse, Error, UseUsersSelected>({
    queryKey: stableUsersKey(params),
    queryFn: () => UserService.getUsers(params),
    enabled: enabled && params.PageNumber > 0 && params.PageSize > 0,
    select: (data) => ({
      users: data.data ?? [],
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

    users: query.data?.users ?? [],
    metadata: query.data?.metadata,
    message: query.data?.message,
    isSuccess: query.data?.isSuccess,
  };
}

export function useUserById(id: string, enabled = true) {
  const query = useQuery<UserDetailResponse, Error>({
    queryKey: ["users", "detail", id],
    queryFn: () => UserService.getUserById(id),
    enabled: enabled && !!id,
    staleTime: 30_000,
  });

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,

    user: query.data?.data,
    message: query.data?.message,
    isSuccess: query.data?.isSuccess,
  };
}
