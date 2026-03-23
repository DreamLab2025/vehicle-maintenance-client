// app/(admin)/admin/users/page.tsx
"use client";

import * as React from "react";
import { AlertCircle, LayoutGrid, Plus, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type { UserDto, UsersQueryParams } from "@/lib/api/services/fetchUsers";
import { useUsers, useUserById } from "@/hooks/useUsers";
import { TableSkeleton } from "@/components/ui/skeletons";

/** ===================== Helpers ===================== */
function fmtDateTime(s?: string | null) {
  if (!s) return "-";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString("vi-VN");
}

function fmtBool(v: boolean) {
  return v ? "Yes" : "No";
}

/** ===================== UI Components (inline) ===================== */

function UsersToolbar(props: {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  sortDescending: boolean;
  onSortChange: (v: boolean) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}) {
  const { searchTerm, onSearchChange, sortDescending, onSortChange, onRefresh, isLoading } = props;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-slate-600">Tìm kiếm</label>
          <input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo username, email, role..."
            className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-slate-200"
            onClick={() => onSortChange(!sortDescending)}
            disabled={isLoading}
          >
            {sortDescending ? "Mới nhất" : "Cũ nhất"}
          </Button>

          <Button type="button" variant="outline" className="border-slate-200" onClick={onRefresh} disabled={isLoading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>

          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 transition-all active:scale-95"
            onClick={() => toast.message("Users API hiện chỉ hỗ trợ GET. Chưa có endpoint tạo user cho Admin.")}
          >
            <Plus className="mr-2 h-5 w-5" />
            Thêm người dùng
          </Button>
        </div>
      </div>
    </div>
  );
}

function UsersPagination(props: {
  page: number;
  pageSize: number;
  onPageChange: (v: number) => void;
  onPageSizeChange: (v: number) => void;
  metadata?: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}) {
  const { page, pageSize, onPageChange, onPageSizeChange, metadata } = props;

  const totalPages = metadata?.totalPages ?? 1;
  const totalItems = metadata?.totalItems ?? 0;
  const canPrev = metadata?.hasPreviousPage ?? page > 1;
  const canNext = metadata?.hasNextPage ?? page < totalPages;

  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = totalItems === 0 ? 0 : Math.min(page * pageSize, totalItems);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="text-sm text-slate-600">
        Hiển thị{" "}
        <span className="font-medium text-slate-900">
          {from}-{to}
        </span>{" "}
        / <span className="font-medium text-slate-900">{totalItems}</span> — Trang{" "}
        <span className="font-medium text-slate-900">{page}</span> /{" "}
        <span className="font-medium text-slate-900">{totalPages}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600">Page size</span>
          <select
            value={String(pageSize)}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-slate-200"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={!canPrev}
          >
            Trước
          </Button>

          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => onPageChange(page + 1)}
            disabled={!canNext}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}

function RoleChips({ roles }: { roles: string[] }) {
  if (!roles || roles.length === 0) return <span className="text-slate-400">-</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((r) => (
        <span
          key={r}
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700"
        >
          {r}
        </span>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs border",
        isActive ? "border-red-200 bg-red-50 text-red-700" : "border-slate-200 bg-slate-50 text-slate-600",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function UsersTable(props: { data: UserDto[]; onView: (u: UserDto) => void; disabled?: boolean }) {
  const { data, onView, disabled } = props;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-left text-slate-600">
              <th className="py-3 px-4 w-[260px]">User</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4 w-[160px]">Verified</th>
              <th className="py-3 px-4 w-[220px]">Roles</th>
              <th className="py-3 px-4 w-[190px]">Created</th>
              <th className="py-3 px-4 w-[140px] text-right">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {data.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                <td className="py-3 px-4">
                  <div className="font-medium text-slate-900 line-clamp-1">{u.userName}</div>
                  <div className="text-xs text-slate-500 font-mono line-clamp-1">{u.id}</div>
                </td>

                <td className="py-3 px-4 text-slate-700">{u.email}</td>

                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-700">
                      Email:{" "}
                      <span
                        className={[
                          "ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs border",
                          u.emailVerified
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-slate-200 bg-slate-50 text-slate-600",
                        ].join(" ")}
                      >
                        {fmtBool(u.emailVerified)}
                      </span>
                    </span>
                    <span className="text-xs text-slate-700">
                      Phone:{" "}
                      <span
                        className={[
                          "ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs border",
                          u.phoneNumberVerified
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-slate-200 bg-slate-50 text-slate-600",
                        ].join(" ")}
                      >
                        {fmtBool(u.phoneNumberVerified)}
                      </span>
                    </span>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <RoleChips roles={u.roles} />
                </td>

                <td className="py-3 px-4 text-slate-600">{fmtDateTime(u.createdAt)}</td>

                <td className="py-3 px-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-200"
                    onClick={() => onView(u)}
                    disabled={disabled}
                  >
                    Xem
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserDetailDialog(props: { open: boolean; onOpenChange: (v: boolean) => void; userId: string | null }) {
  const { open, onOpenChange, userId } = props;

  const { user, isLoading, isFetching, isError, refetch } = useUserById(userId ?? "", open && !!userId);

  React.useEffect(() => {
    if (open && userId) void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, userId]);

  return (
    <div
      className={["fixed inset-0 z-50", open ? "pointer-events-auto" : "pointer-events-none"].join(" ")}
      aria-hidden={!open}
    >
      {/* overlay */}
      <div
        className={["absolute inset-0 bg-black/30 transition-opacity", open ? "opacity-100" : "opacity-0"].join(" ")}
        onClick={() => onOpenChange(false)}
      />

      {/* panel */}
      <div
        className={[
          "absolute right-0 top-0 h-full w-full max-w-[520px] bg-white border-l border-slate-200 shadow-2xl",
          "transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-slate-900">Chi tiết người dùng</div>
          </div>
          <Button variant="outline" className="border-slate-200" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>

        <div className="p-5 space-y-4">
          {isError ? (
            <div className="rounded-xl border border-dashed border-red-200 bg-white p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <div className="font-medium">Không tải được chi tiết</div>
              </div>
              <div className="text-sm text-slate-500 mt-1">Vui lòng thử lại.</div>
              <Button
                variant="outline"
                className="border-slate-200 mt-3"
                onClick={() => refetch()}
                disabled={isLoading || isFetching}
              >
                Tải lại
              </Button>
            </div>
          ) : isLoading || isFetching ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-slate-50 border border-slate-100 animate-pulse" />
              ))}
            </div>
          ) : !user ? (
            <div className="text-sm text-slate-500">Không có dữ liệu.</div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="text-xs text-slate-500">ID</div>
                <div className="font-mono text-sm text-slate-900 break-all">{user.id}</div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="text-xs text-slate-500">UserName</div>
                <div className="text-sm text-slate-900">{user.userName}</div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="text-xs text-slate-500">Email</div>
                <div className="text-sm text-slate-900">{user.email}</div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="text-xs text-slate-500">Phone</div>
                <div className="text-sm text-slate-900">{user.phoneNumber || "-"}</div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="text-xs text-slate-500">Verified</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs border",
                      user.emailVerified
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-slate-200 bg-slate-50 text-slate-600",
                    ].join(" ")}
                  >
                    Email: {fmtBool(user.emailVerified)}
                  </span>

                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs border",
                      user.phoneNumberVerified
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-slate-200 bg-slate-50 text-slate-600",
                    ].join(" ")}
                  >
                    Phone: {fmtBool(user.phoneNumberVerified)}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="text-xs text-slate-500">Roles</div>
                <div className="mt-2">
                  <RoleChips roles={user.roles} />
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="text-xs text-slate-500">Created At</div>
                <div className="text-sm text-slate-900">{fmtDateTime(user.createdAt)}</div>
              </div>

              <div className="text-xs text-slate-500">
                Lưu ý: API Users hiện chỉ hỗ trợ GET, chưa có action update/ban/role.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** ===================== Page ===================== */

export default function UsersPage() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortDescending, setSortDescending] = React.useState(true);

  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const params = React.useMemo<UsersQueryParams>(
    () => ({
      PageNumber: page,
      PageSize: pageSize,
      IsDescending: sortDescending,
    }),
    [page, pageSize, sortDescending],
  );

  const { users, metadata, isLoading, isFetching, isError, refetch } = useUsers(params, true);

  // reset page when pageSize/sort change
  React.useEffect(() => {
    setPage(1);
  }, [pageSize, sortDescending]);

  const filtered = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) => {
      const haystack = [u.userName, u.email, u.phoneNumber, ...(u.roles ?? [])].filter(Boolean).join(" ").toLowerCase();

      return haystack.includes(q);
    });
  }, [users, searchTerm]);

  const handleView = (u: UserDto) => {
    setSelectedUserId(u.id);
    setDetailOpen(true);
  };

  const showSkeleton = isLoading || isFetching;

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5">
        <div>
          <h1 className="text-3xl tracking-tight text-slate-900">Quản lý Người dùng</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Danh sách người dùng trong hệ thống (Read-only theo API hiện tại).
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-5">
        <UsersToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortDescending={sortDescending}
          onSortChange={setSortDescending}
          onRefresh={() => refetch()}
          isLoading={showSkeleton}
        />
      </div>

      {/* Content */}
      <div className="min-h-[420px] px-5">
        {isError ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-red-200">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">Không thể tải dữ liệu</h3>
            <p className="text-slate-500 mb-6 text-sm">Vui lòng kiểm tra API và thử lại.</p>
            <Button variant="outline" className="border-slate-200" onClick={() => refetch()}>
              Tải lại
            </Button>
          </div>
        ) : showSkeleton ? (
          <TableSkeleton rows={6} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <LayoutGrid className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">Không có người dùng phù hợp</p>
            <Button variant="link" className="text-red-600 mt-1" onClick={() => setSearchTerm("")}>
              Xoá bộ lọc
            </Button>
          </div>
        ) : (
          <UsersTable data={filtered} onView={handleView} />
        )}
      </div>

      {/* Pagination */}
      <div className="px-5">
        <UsersPagination
          metadata={metadata}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Detail Drawer */}
      <UserDetailDialog
        open={detailOpen}
        onOpenChange={(v) => {
          setDetailOpen(v);
          if (!v) setSelectedUserId(null);
        }}
        userId={selectedUserId}
      />
    </div>
  );
}
