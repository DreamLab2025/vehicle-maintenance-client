"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PartProduct } from "@/lib/api/services/fetchPartProducts";

function formatVnd(v: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v);
}

export default function ProductsTable(props: {
  data: PartProduct[];
  onEdit: (p: PartProduct) => void;
  onDelete: (p: PartProduct) => void;
  isDeletingId: string | null;
}) {
  const { data, onEdit, onDelete, isDeletingId } = props;

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-left text-slate-600">
              <th className="py-3 px-4">Sản phẩm</th>
              <th className="py-3 px-4">Hãng</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Giá tham khảo</th>
              <th className="py-3 px-4">Chu kỳ</th>
              {/* <th className="py-3 px-4">Trạng thái</th> */}
              <th className="py-3 px-4 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {data.map((p) => {
              const deleting = isDeletingId === p.id;

              return (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 min-w-[320px]">
                      <div className="h-12 w-12 rounded-md border border-slate-100 bg-white overflow-hidden relative">
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="h-full w-full bg-slate-50" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{p.description}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-700">{p.brand}</td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
                      {p.partCategoryName}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-700">{formatVnd(p.referencePrice)}</td>

                  <td className="py-3 px-4 text-slate-700">
                    <div className="text-xs">
                      <div>{p.recommendedKmInterval.toLocaleString("vi-VN")} km</div>
                      <div>{p.recommendedMonthsInterval} tháng</div>
                    </div>
                  </td>

                  {/* <td className="py-3 px-4">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs border",
                        p.isActive
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-slate-200 bg-slate-50 text-slate-600",
                      ].join(" ")}
                    >
                      {p.status}
                    </span>
                  </td> */}

                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        className="border-slate-200"
                        onClick={() => onEdit(p)}
                        disabled={deleting}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Sửa
                      </Button>

                      <Button
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(p)}
                        disabled={deleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deleting ? "Đang xóa..." : "Xóa"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
