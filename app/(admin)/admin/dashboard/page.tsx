"use client";

import { useMemo } from "react";
import {
  BadgeCent,
  BikeIcon,
  Layers3,
  Users,
  Package,
  Wrench,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBrands } from "@/hooks/useBrand";
import { useTypes } from "@/hooks/useType";
import { useModels } from "@/hooks/useModel";
import { useUsers } from "@/hooks/useUsers";

/* ============================
   Stat Card
============================ */
interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  isLoading?: boolean;
  className?: string;
}

function StatCard({ title, value, subtitle, icon: Icon, trend, isLoading, className }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 pt-1">
                {trend.value >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs font-medium ${
                    trend.value >= 0 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================
   Recent Table
============================ */
interface RecentItem {
  id: string;
  name: string;
  type: string;
  date: string;
  status: "success" | "pending" | "error";
}

interface RecentTableProps {
  title: string;
  items: RecentItem[];
  isLoading?: boolean;
  emptyMessage?: string;
}

function RecentTable({ title, items, isLoading, emptyMessage = "Không có dữ liệu" }: RecentTableProps) {
  const statusVariant = {
    success: "default" as const,
    pending: "secondary" as const,
    error: "destructive" as const,
  };
  const statusLabel = {
    success: "Thành công",
    pending: "Đang xử lý",
    error: "Lỗi",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-3 px-6 pb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="px-6 pb-6 text-sm text-muted-foreground italic">{emptyMessage}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{item.date}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[item.status]} className="text-xs">
                      {statusLabel[item.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

/* ============================
   Page
============================ */
export default function DashboardPage() {
  const brandsQuery = useBrands({ PageNumber: 1, PageSize: 1 });
  const typesQuery = useTypes({ PageNumber: 1, PageSize: 1 });
  const modelsQuery = useModels({ PageNumber: 1, PageSize: 1 });
  const usersQuery = useUsers({ PageNumber: 1, PageSize: 1, IsDescending: true });

  const brandsCount = brandsQuery.brands?.length ?? 0;
  const typesCount = typesQuery.types?.length ?? 0;
  const modelsCount = modelsQuery.models?.length ?? 0;
  const usersCount = usersQuery.users?.length ?? 0;

  const recentBrands = useMemo<RecentItem[]>(() => {
    if (!brandsQuery.brands) return [];
    return brandsQuery.brands.slice(0, 5).map((b) => ({
      id: b.id,
      name: b.name,
      type: "Thương hiệu",
      date: new Date(b.createdAt).toLocaleDateString("vi-VN"),
      status: "success" as const,
    }));
  }, [brandsQuery.brands]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Chào mừng bạn quay trở lại Verendar Admin
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <StatCard
          title="Thương hiệu"
          value={brandsQuery.metadata?.totalItems ?? brandsCount}
          subtitle="Tổng số hãng xe"
          icon={BadgeCent}
          isLoading={brandsQuery.isLoading}
          trend={{ value: 12, label: "so với tháng trước" }}
        />
        <StatCard
          title="Loại xe"
          value={typesQuery.metadata?.totalItems ?? typesCount}
          subtitle="Phân loại phương tiện"
          icon={Layers3}
          isLoading={typesQuery.isLoading}
          trend={{ value: 5, label: "so với tháng trước" }}
        />
        <StatCard
          title="Mẫu xe"
          value={modelsQuery.metadata?.totalItems ?? modelsCount}
          subtitle="Dòng xe trong hệ thống"
          icon={BikeIcon}
          isLoading={modelsQuery.isLoading}
          trend={{ value: 8, label: "so với tháng trước" }}
        />
        <StatCard
          title="Người dùng"
          value={usersQuery.metadata?.totalItems ?? usersCount}
          subtitle="Tài khoản đã đăng ký"
          icon={Users}
          isLoading={usersQuery.isLoading}
          trend={{ value: 24, label: "so với tháng trước" }}
        />
        <StatCard
          title="Danh mục phụ tùng"
          value="—"
          subtitle="Xem trong mục phụ tùng"
          icon={Wrench}
        />
        <StatCard
          title="Sản phẩm phụ tùng"
          value="—"
          subtitle="Xem trong mục phụ tùng"
          icon={Package}
        />
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentTable
          title="Thương hiệu mới thêm gần đây"
          items={recentBrands}
          isLoading={brandsQuery.isLoading}
          emptyMessage="Chưa có thương hiệu nào"
        />

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { label: "Thêm thương hiệu", href: "/admin/brands", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
              { label: "Thêm loại xe", href: "/admin/vehicles", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
              { label: "Thêm mẫu xe", href: "/admin/models", color: "bg-orange-50 text-orange-600 hover:bg-orange-100" },
              { label: "Quản lý người dùng", href: "/admin/users", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className={`flex items-center justify-center rounded-xl border p-3 text-sm font-medium transition-colors ${action.color}`}
              >
                {action.label}
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
