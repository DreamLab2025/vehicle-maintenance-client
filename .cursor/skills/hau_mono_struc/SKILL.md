---
description: Hau Mono Structure — Quy định cấu trúc thư mục, quy tắc đặt file, tách component, patterns API/state/realtime/i18n cho dự án Research Hub monorepo. KHÔNG chứa UI styling.
alwaysApply: false
---

# 🏗️ HAU MONO STRUCTURE — Project Architecture Skill

> Bạn là **Senior Software Architect** chuyên sâu về cấu trúc dự án Next.js App Router. Skill này CHỈ quy định **cấu trúc thư mục, quy tắc đặt file, tách component, patterns hạ tầng**. Cách styling/animation do **skill UI** quyết định.

---

## 📌 TỔNG QUAN CÔNG NGHỆ

| Layer | Công nghệ |
|---|---|
| Framework | Next.js 15+ App Router |
| Ngôn ngữ | TypeScript |
| State | Redux Toolkit + React Query |
| Realtime | SignalR |
| i18n | next-intl (`en`, `vi`) |
| API | Axios singleton + interceptors |

---

## 🗂️ CÂY THƯ MỤC CHÍNH

```text
research-hub-client/
├── app/
│   ├── [locale]/
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   │       ├── components/features/
│   │   │       └── layout.tsx
│   │   ├── (auth)/
│   │   │   └── login/
│   │   ├── (department_head)/
│   │   │   └── department-head/
│   │   ├── (project)/
│   │   │   └── project/
│   │   │       ├── [id]/
│   │   │       └── components/
│   │   ├── (student)/
│   │   ├── manage-project/
│   │   └── layout.tsx
│   ├── favicon.ico
│   └── globals.css
│
├── components/
│   ├── layout/          # AppHeader, AppSidebar, AppLayout
│   ├── ui/              # Shadcn primitives (Button, Dialog, Table...)
│   └── widget/          # Business widgets (auth, department, project...)
│
├── hooks/               # useAuth, useSignalR, useProject...
├── i18n/                # routing.ts, request.ts
├── lib/
│   ├── api/
│   │   ├── core.ts      # Axios singleton + interceptors
│   │   └── services/    # fetchAuth, fetchProject, fetchUsers...
│   ├── providers/       # Redux, Query, SignalR, AuthSync
│   ├── realtime/        # signalr.ts singleton
│   ├── redux/           # store, slices, typed hooks
│   ├── types/
│   └── utils/
│
├── messages/
│   ├── en/
│   └── vi/
│
├── public/
├── types/               # Global shared types
├── utils/               # Helpers (cookie config...)
│
├── Dockerfile
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 📍 VAI TRÒ TỪNG KHU VỰC

### `app/` — Route & Màn hình
- Dùng App Router của Next.js
- Route chia theo role bằng route groups:
  - `(admin)` → các màn quản trị
  - `(auth)` → đăng nhập/xác thực
  - `(department_head)` → tính năng trưởng bộ môn
  - `(project)` → tính năng đề tài/dự án
  - `(student)` → tính năng sinh viên
- `[locale]` để hỗ trợ đa ngôn ngữ theo URL

### `components/` — Thành phần giao diện dùng chung
- `components/ui/`: component UI cơ bản (button, dialog, table...)
- `components/layout/`: AppHeader, AppSidebar, AppLayout
- `components/widget/`: widget theo nghiệp vụ (auth, department, project...)

### `hooks/` — Custom hooks
- Gom hooks cho auth, data fetching, realtime, infinite scroll...
- Mục tiêu: tách logic khỏi component để dễ tái sử dụng

### `lib/` — Tầng hạ tầng
- `lib/api/core.ts`: Axios singleton + interceptors
- `lib/api/services/`: hàm gọi API theo module nghiệp vụ
- `lib/providers/`: provider gốc (Redux, Query, SignalR)
- `lib/redux/`: store, slices, typed hooks
- `lib/realtime/`: setup SignalR
- `lib/utils/`: helper dùng chung

### `messages/` & `i18n/` — Đa ngôn ngữ
- `messages/en`, `messages/vi`: file json dictionary
- `i18n/routing.ts`, `i18n/request.ts`: config định tuyến và locale handling

### `types/` & `utils/` (root)
- `types/`: kiểu dữ liệu dùng chung toàn app
- `utils/`: helper theo mục đích riêng (vd: cookie config)

---

## 📍 QUY TẮC ĐẶT FILE (BẮT BUỘC)

### Component đặt ở đâu?

| Điều kiện | Vị trí |
|---|---|
| Chỉ dùng trong 1 route/feature cụ thể | `app/[locale]/(role)/route/components/features/...` |
| Dùng lại giữa nhiều route, gắn nghiệp vụ | `components/widget/<domain>/` |
| UI primitive, không business logic | `components/ui/` |
| Khung bố cục cấp app/section | `components/layout/` |

### Quy tắc đặt tên

| Loại | Convention | Ví dụ |
|---|---|---|
| Component file | PascalCase | `ProjectHeader.tsx`, `SeminarMemberTable.tsx` |
| Feature folder | PascalCase | `Overview/`, `SeminarQuestion/` |
| Hook | camelCase + `use` | `useProject.ts`, `useUsers.ts` |
| Service API | `fetch<Domain>.ts` | `fetchProject.ts`, `fetchUsers.ts` |

---

## 🧩 QUY TẮC TÁCH COMPONENT

### Mục tiêu
- UI dễ test, dễ tái sử dụng, dễ đọc
- Mỗi component có 1 trách nhiệm rõ ràng
- Tránh file `page.tsx` quá lớn (chỉ nên làm orchestration)

### Tách theo cấp

1. **`page.tsx`** — Chỉ xử lý flow: lấy params, chọn feature, compose layout. Không viết UI chi tiết.
2. **`components/features/<Feature>/page.tsx`** — Đại diện cho 1 feature lớn trong route. Có thể tách nhỏ tiếp.
3. **`components/features/<Feature>/components/*`** — Block UI con: header, table, card, chart, form.
4. **`components/features/shared.ts`** — Constants/types/helpers dùng chung giữa nhiều feature cùng route.

### Pattern feature mới
```text
components/features/NewFeature/
├── page.tsx              # Compose: gọi hooks, truyền props cho con
├── components/
│   ├── NewFeatureHeader.tsx
│   ├── NewFeatureTable.tsx
│   └── NewFeatureForm.tsx
└── types.ts              # (optional)
```

### Giới hạn tránh "god component"
- Component > ~250 dòng VÀ xử lý nhiều mục đích → **PHẢI tách**
- 1 file vừa fetch, vừa validate, vừa render bảng phức tạp → tách 2–4 component/hook
- Ưu tiên **Container + Presentational**:
  - Container: xử lý data/side effects
  - Presentational: nhận props, render UI

---

## ⚡ PATTERNS HẠ TẦNG (GIỮ NGUYÊN)

### Thứ tự Providers
```
ReduxProvider → QueryProvider → SignalRProvider → AuthSyncProvider
```
- SignalR cần auth state từ Redux
- Query cache độc lập với global state
- Auth sync theo tab cần dispatch vào Redux

### API Layer
- `lib/api/core.ts`:
  - Axios singleton
  - Request interceptor đính kèm bearer token
  - Response interceptor xử lý `401` + refresh token queue + retry request cũ
- `lib/api/services/fetchXxx.ts`:
  - Mỗi domain 1 file (`fetchAuth`, `fetchProject`, `fetchUsers`...)
  - Service trả về typed response, KHÔNG render/toast trong service

### State & Auth
- `lib/redux/slices/authSlice.ts`:
  - `role` dạng `string[]`
  - Có `refreshToken` trong state
  - Có cơ chế `setupAutoRefresh` trước hạn token
- `hooks/useAuth.ts`:
  - Xử lý login/logout + role-based redirect
  - UI page gọi hook, tránh gọi trực tiếp service + dispatch lẫn lộn

### Realtime
- `lib/realtime/signalr.ts`:
  - 1 singleton connection
  - Có `startHubConnection`/`stopHubConnection`
- `hooks/useSignalR.ts` + `hooks/useSignalRNotifications.ts`:
  - Tách kết nối và lắng nghe event thành 2 hook riêng
  - Đặt trong `SignalRProvider` để app chỉ mở 1 kênh realtime

### i18n & Route Groups
- Duy trì `app/[locale]` cho toàn bộ route business
- Role routes đồng bộ theo nhóm: `(admin)`, `(auth)`, `(department_head)`, `(project)`, `(student)`
- Dictionary tại `messages/en` và `messages/vi` với cùng key structure

---

## 🚀 CHECKLIST SCAFFOLD TỐI THIỂU

1. Tạo khung thư mục: `app`, `components`, `lib`, `hooks`, `types`, `utils`, `messages`
2. Tạo core files:
   - `lib/api/core.ts`
   - `lib/redux/store.ts`, `lib/redux/hooks.ts`, `lib/redux/slices/authSlice.ts`
   - `lib/providers/{reduxProvider,queryProvider,signalRProvider,index}.tsx`
   - `lib/realtime/signalr.ts`
3. Tạo hooks xương sống:
   - `useAuth`, `useSignalR`, `useSignalRNotifications`, `useAuthSyncAcrossTabs`
4. Tạo i18n:
   - `i18n/routing.ts`, `i18n/request.ts`, `messages/en/*.json`, `messages/vi/*.json`
5. Tạo layer UI:
   - `components/ui`, `components/layout`, `components/widget`
6. Chốt code quality:
   - lint + type-check + format

---

## ⚠️ KHÔNG BAO GIỜ LÀM

1. ❌ Đặt file component sai vị trí theo bảng quy tắc trên
2. ❌ Gọi API trực tiếp trong UI component — phải qua `lib/api/services/`
3. ❌ Viết logic phức tạp trong `page.tsx` — page chỉ orchestrate
4. ❌ Bỏ TypeScript types
5. ❌ Trộn lẫn business logic vào `components/ui/`
6. ❌ Tạo thêm route group ngoài quy ước role đã định
7. ❌ Toast/render trong service layer
8. ❌ Bỏ i18n key sync giữa `en` và `vi`
9. ❌ Tự ý thay đổi thứ tự Providers
10. ❌ **Tự quyết định styling/animation** — phải tuân theo skill UI

---

## ✅ CHECKLIST TRƯỚC KHI OUTPUT

- [ ] File đặt đúng vị trí theo bảng quy tắc?
- [ ] Đặt tên đúng convention (PascalCase/camelCase/fetch prefix)?
- [ ] page.tsx chỉ làm orchestration?
- [ ] Component < 250 dòng, đơn trách nhiệm?
- [ ] API call qua service layer, không gọi trực tiếp?
- [ ] TypeScript interfaces đầy đủ?
- [ ] i18n keys sync giữa en/vi?
- [ ] Providers đúng thứ tự?

---

## 📝 GHI CHÚ

- Project đang chạy port `5174`
- Tailwind v4 pattern (`@tailwindcss/postcss`, không bắt buộc `tailwind.config.ts`)
- Nếu dùng middleware RBAC, ưu tiên decode role array + xử lý token hết hạn ngay tại middleware