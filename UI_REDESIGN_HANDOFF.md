# Vehicle Maintenance Client - UI Redesign Handoff

Tài liệu này dùng để gửi cho AI/UI Designer nhằm redesign giao diện mà không đổi nghiệp vụ hiện có.

## 1) Product Scope (Hiện trạng)

- Ứng dụng quản lý bảo dưỡng phương tiện.
- Có 2 nhóm chính:
  - User app: quản lý xe cá nhân, phụ tùng, nhắc bảo dưỡng, map, thông báo, profile.
  - Admin app: CRUD danh mục xe/phụ tùng/người dùng.
- Đa ngôn ngữ: `vi`, `en` (i18n đang dùng `react-i18next` + JSON messages).

## 2) Navigation Rules (Quan trọng cho redesign)

- Route prefix theo locale: `/{locale}/...` (ví dụ: `/vi/...`, `/en/...`).
- Bottom navigation hiện tại:
  - Chỉ hiển thị ở Home page: `/{locale}`.
  - Không hiển thị ở các trang còn lại.

## 3) Danh sách trang hiện có

## Public/Auth

- `/{locale}/login` - đăng nhập
- `/{locale}/register` - đăng ký
- `/{locale}/verifyotp` - xác thực OTP
- `/{locale}/forgot-password` - quên mật khẩu
- `/{locale}/reset-password` - đặt lại mật khẩu
- `/{locale}/onboarding` - onboarding sau auth

## User/Main

- `/{locale}` - Home dashboard người dùng
- `/{locale}/map` - bản đồ garage (bản map riêng)
- `/{locale}/maps` - maps trong user group
- `/{locale}/notifications` - danh sách thông báo
- `/{locale}/notifications/[id]` - chi tiết thông báo
- `/{locale}/odometer/[id]` - lịch sử/chỉ số odometer
- `/{locale}/profile` - hồ sơ cá nhân
- `/{locale}/settings` - cài đặt

## Maintenance Flow

- `/{locale}/maintenance` - danh sách/hub bảo dưỡng
- `/{locale}/maintenance/new` - tạo bảo dưỡng mới
- `/{locale}/maintenance/[categoryId]` - chi tiết bảo dưỡng theo hạng mục

## Vehicle Flow

- `/{locale}/vehicle/add` - thêm xe (wizard nhiều bước)
- `/{locale}/vehicle/[id]` - chi tiết xe
- `/{locale}/vehicle/[id]/parts/[partCode]` - khai báo phụ tùng theo mã

## Admin

- `/{locale}/admin/dashboard` - tổng quan admin
- `/{locale}/admin/vehicles` - quản lý loại xe
- `/{locale}/admin/brands` - quản lý thương hiệu
- `/{locale}/admin/models` - quản lý mẫu xe
- `/{locale}/admin/variants` - quản lý màu/ảnh biến thể
- `/{locale}/admin/parts` - quản lý danh mục phụ tùng
- `/{locale}/admin/products` - quản lý sản phẩm phụ tùng
- `/{locale}/admin/users-vehicles` - quản lý xe của user
- `/{locale}/admin/users` - quản lý người dùng

## 4) Tính năng nghiệp vụ hiện có (để giữ nguyên behavior)

## Authentication

- Login / Register / Verify OTP / Forgot Password / Reset Password.
- JWT qua cookie.
- Redirect theo role.

## Vehicle Management (User)

- Xem danh sách xe của user.
- Thêm xe theo wizard nhiều bước:
  - chọn kiểu nhập
  - chọn loại xe
  - chọn thương hiệu
  - chọn model
  - nhập thông tin cơ bản
- Xem chi tiết xe.
- Khai báo phụ tùng chưa khai báo cho xe.

## Maintenance

- Danh sách bảo dưỡng.
- Tạo mới bảo dưỡng.
- Xem theo category.
- Hiển thị records + detail sheet.

## Reminder & Notification

- Reminder theo phụ tùng/mốc bảo dưỡng.
- Detail sheet reminder (timeline/progress/chips/stats).
- Notification dropdown.
- Danh sách + chi tiết thông báo.

## Odometer

- Theo dõi/chỉnh sửa chỉ số odometer theo xe.
- Biểu đồ lịch sử odometer.

## Maps

- Hiển thị bản đồ, marker garage, tìm kiếm và chọn garage.

## Admin CRUD Modules

- Vehicles types
- Brands
- Models
- Variants
- Parts categories
- Parts products
- Users vehicles
- Users

## 5) Data/API modules hiện có

Các service chính:

- `lib/api/services/fetchAuth.ts`
- `lib/api/services/fetchUserVehicle.ts`
- `lib/api/services/fetchUsers.ts`
- `lib/api/services/fetchBrand.ts`
- `lib/api/services/fetchModel.ts`
- `lib/api/services/fetchType.ts`
- `lib/api/services/fetchVariants.ts`
- `lib/api/services/fetchPartCategories.ts`
- `lib/api/services/fetchPartProducts.ts`
- `lib/api/services/maintenanceRecord.service.ts`
- `lib/api/services/notification.service.ts`
- `lib/api/services/userVehicle.service.ts`

Hooks chính:

- `hooks/useAuth.ts`
- `hooks/useUserVehice.ts`
- `hooks/useMaintenanceRecord.ts`
- `hooks/useNotification.ts`
- `hooks/useBrand.ts`
- `hooks/useModel.ts`
- `hooks/useType.ts`
- `hooks/useVariants.ts`
- `hooks/usePartCategories.ts`
- `hooks/usePartProducts.ts`
- `hooks/useUsers.ts`

## 6) Shared UI/Widget blocks đang dùng

- Layout:
  - `components/layout/Header.tsx`
  - `components/layout/BottomNav.tsx`
  - `components/layout/AppSidebarAdmin.tsx`
- Widgets:
  - `components/widget/vehicle/CarStackCarousel.tsx`
  - `components/widget/maintenance/*`
  - `components/widget/reminder/ReminderDetailSheet/*`
  - `components/widget/notification/NotificationDropdown.tsx`
  - `components/widget/odometer/OdometerHistoryChart.tsx`

## 7) Yêu cầu cho AI redesign (copy nguyên block này khi gửi)

1. Chỉ đổi UI/UX (layout, component visual, animation, spacing, typography, color).
2. Không đổi business logic, API contract, route, state flow.
3. Giữ nguyên toàn bộ path/slug trang ở mục "Danh sách trang hiện có".
4. Giữ rule: chỉ Home `/{locale}` có BottomNav.
5. Giữ i18n key structure hiện có (`vi`, `en`).
6. Ưu tiên tách UI thành component nhỏ, không để page quá lớn.
7. Cần có loading/skeleton, empty state, error state nhất quán.
8. Responsive mobile-first, hỗ trợ dark mode.

## 8) Prompt mẫu để gửi cho chat generate UI

```md
Dựa trên tài liệu UI_REDESIGN_HANDOFF.md này, hãy redesign toàn bộ UI theo style [ghi style bạn muốn ở đây], nhưng:
- KHÔNG thay đổi logic nghiệp vụ
- KHÔNG đổi route/path
- KHÔNG đổi API/service hooks
- Chỉ refactor phần trình bày + tách component UI hợp lý
- Giữ rule: chỉ home có BottomNav

Hãy trả ra theo từng màn hình:
1) Mục tiêu UX
2) Cấu trúc component đề xuất
3) Wireframe mô tả
4) Code patch theo từng file
```

