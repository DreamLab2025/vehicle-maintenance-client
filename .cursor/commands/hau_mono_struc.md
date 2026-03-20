---
description: "Hau Mono Structure — Command kích hoạt CHỉ skill cấu trúc (hau_mono_struc). Scaffold, tách component, đặt file đúng chỗ, setup hạ tầng — KHÔNG styling/animation."
---

# 🏗️ /hau_mono_struc — Structure-Only Command

> Kích hoạt **CHỈ** skill `.cursor/skills/hau_mono_struc/SKILL.md`.
> Tập trung 100% vào kiến trúc, vị trí file, tách component, hạ tầng.
> **KHÔNG** xử lý UI styling/animation — đó là việc của skill `hau_next_UI`.

---

## 📌 KHI NÀO DÙNG

- Scaffold feature/route mới → cần biết tạo file gì, đặt đâu
- Tách component lớn → chia nhỏ đúng convention
- Thêm API service / hook / Redux slice / i18n mới
- Review cấu trúc code hiện có
- Thêm route group hoặc role mới
- Refactor hạ tầng (providers, SignalR, API layer)

---

## 🧠 QUY TRÌNH BẮT BUỘC

### 1. Xác định scope
```
→ Role nào: admin / auth / department_head / project / student
→ Scope: route-specific / cross-route widget / global / layout
→ Layers cần: route + feature + API + hook + i18n?
```

### 2. Quyết định vị trí file
```
Chỉ dùng trong 1 route?
  → YES: app/[locale]/(role)/route/components/features/...
  → NO:  Có nghiệp vụ?
           → YES: components/widget/<domain>/
           → NO:  UI thuần → components/ui/
                  Bố cục  → components/layout/
```

### 3. Tách component
```
page.tsx         → chỉ orchestrate
Feature/page.tsx → compose hooks + truyền props
Feature/components/* → header, table, form, card riêng
shared.ts        → constants/types/helpers dùng chung
Giới hạn: < 250 dòng, đơn trách nhiệm
```

### 4. Tạo hạ tầng đi kèm
```
API service  → lib/api/services/fetch<Domain>.ts
Hook         → hooks/use<Domain>.ts
Redux slice  → lib/redux/slices/<domain>Slice.ts (nếu cần)
i18n         → messages/en/<domain>.json + messages/vi/<domain>.json
Types        → types/<domain>.ts hoặc feature/types.ts
```

---

## 📋 OUTPUT FORMAT BẮT BUỘC

### ① Cây thư mục — file cần tạo/sửa
```text
app/[locale]/(admin)/admin/users/
├── page.tsx
├── components/features/
│   ├── UserList/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── UserListHeader.tsx
│   │       └── UserTable.tsx
│   └── shared.ts
lib/api/services/fetchUsers.ts
hooks/useUsers.ts
messages/en/users.json
messages/vi/users.json
```

### ② Trách nhiệm từng file
```
- page.tsx: Orchestrate, lấy params, render feature
- UserList/page.tsx: Gọi useUsers(), truyền data cho con
- UserListHeader.tsx: Search + filter + create button
- UserTable.tsx: TanStack Table, nhận data qua props
- fetchUsers.ts: CRUD API, trả typed response
- useUsers.ts: React Query wrap fetchUsers
```

### ③ Skeleton code (khi user yêu cầu)
- Viết structure + interface + import
- KHÔNG viết styling chi tiết
- Đánh dấu `{/* UI: cần skill hau_next_UI */}` ở chỗ cần styling

---

## 🔗 LIÊN KẾT

```
Skill được kích hoạt:
  .cursor/skills/hau_mono_struc/SKILL.md

Cần thêm UI → chuyển sang:
  /hau_next_mono  (command tổng hợp UI + Structure)
```