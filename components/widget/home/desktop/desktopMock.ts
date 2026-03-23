/**
 * Dữ liệu desktop home CHƯA có API — chỉ dùng cho biểu đồ cột "hoạt động / km theo thời gian".
 * Khi BE có endpoint (vd. GET /analytics/vehicle/:id/daily-km), thay thế MOCK_WEEKLY_ACTIVITY_KM.
 */
export const MOCK_WEEKLY_ACTIVITY_KM: { label: string; km: number }[] = [
  { label: "T2", km: 42 },
  { label: "T3", km: 68 },
  { label: "T4", km: 35 },
  { label: "T5", km: 91 },
  { label: "T6", km: 55 },
  { label: "T7", km: 28 },
  { label: "CN", km: 15 },
];
