---
description: "Hau Next Mono — Command tổng hợp kích hoạt ĐỒNG THỜI cả skill UI (hau_next_UI) và skill Structure (hau_mono_struc). Dùng khi cần tạo/sửa feature đầy đủ: đúng chỗ + đẹp + chuẩn."
---

# 🚀 HAU NEXT MONO — Combined UI + Structure Command

> Command này kích hoạt **CẢ HAI** skill cùng lúc:
> - 🎨 **hau_next_UI** → Cách làm UI: component, animation, styling, responsive, dark mode
> - 🏗️ **hau_mono_struc** → Cấu trúc: đặt file ở đâu, tách component thế nào, patterns hạ tầng
>
> Mọi output phải tuân thủ **CẢ HAI** skill. Không được ưu tiên cái nào hơn cái nào.

---

## 📌 KHI NÀO DÙNG COMMAND NÀY

- Tạo feature mới (cần biết đặt đâu + viết UI thế nào)
- Tạo page mới (cần route group đúng role + layout đẹp)
- Refactor component (cần tách đúng + giữ animation/styling)
- Review code (kiểm tra cả vị trí file lẫn chất lượng UI)
- Scaffold tính năng lớn end-to-end

---

## 🧠 QUY TRÌNH XỬ LÝ (BẮT BUỘC THEO THỨ TỰ)

### Bước 1 — Phân tích yêu cầu
```
1. Xác định loại màn hình: landing / dashboard / detail / list / auth / settings
2. Xác định thuộc role nào: admin / auth / department_head / project / student
3. Xác định scope: route-specific / cross-route widget / global UI / layout
```

### Bước 2 — Quyết định vị trí file (theo SKILL STRUCTURE)
```
┌─ Chỉ dùng trong 1 route?
│  └── YES → app/[locale]/(role)/route/components/features/...
│  └── NO  → Dùng lại giữa nhiều route?
│            └── Có nghiệp vụ → components/widget/<domain>/
│            └── UI thuần     → components/ui/
│            └── Bố cục       → components/layout/
```

### Bước 3 — Thiết kế UI (theo SKILL UI)
```
1. Tìm component: Shadcn → Magic UI → Aceternity → HeroUI
2. Chọn animation pattern: Framer Motion (entrance + hover + scroll)
3. Áp dụng design tokens: Tailwind v4, không hardcode
4. Responsive: mobile-first (sm → md → lg → xl)
5. Dark mode: dark: prefix
6. Loading state: Skeleton
```

### Bước 4 — Tách component (theo SKILL STRUCTURE)
```
1. page.tsx → chỉ orchestrate (lấy params, compose layout)
2. Feature page → compose hooks + truyền props
3. Sub-components → header, table, form, card riêng
4. Shared → constants/types/helpers dùng chung
5. Giới hạn: < 250 dòng/component, đơn trách nhiệm
```

### Bước 5 — Viết code (tuân thủ CẢ HAI skill)
```
- TypeScript interfaces đầy đủ
- Framer Motion animations
- Tailwind v4 tokens (không hex)
- API qua lib/api/services/ (không gọi trực tiếp)
- i18n keys sync en/vi
```

---

## 📋 MASTER CHECKLIST (MERGE CẢ 2 SKILL)

### Structure ✅
- [ ] File đặt đúng vị trí theo bảng quy tắc?
- [ ] Đặt tên đúng convention?
- [ ] page.tsx chỉ làm orchestration?
- [ ] Component < 250 dòng, đơn trách nhiệm?
- [ ] API call qua service layer?
- [ ] Providers đúng thứ tự?
- [ ] i18n keys sync en/vi?

### UI ✅
- [ ] Đã tìm component mẫu từ Shadcn / Magic UI / Aceternity / HeroUI?
- [ ] Có Framer Motion animations (entrance + hover)?
- [ ] Responsive mobile → desktop?
- [ ] Dark mode support?
- [ ] TypeScript interfaces đầy đủ?
- [ ] Skeleton/loading state?
- [ ] Dùng Tailwind v4 tokens (không hardcode)?

---

## 🔗 SKILL DEPENDENCIES

Skill này yêu cầu cả 2 file skill phải tồn tại:

```text
.cursor/skills/hau_next_UI/SKILL.md      ← Chi tiết về UI/UX
.cursor/skills/hau_mono_struc/SKILL.md    ← Chi tiết về cấu trúc
```

Nếu chỉ cần 1 trong 2, dùng skill riêng:
- Chỉ cần UI → kích hoạt `hau_next_UI`
- Chỉ cần Structure → kích hoạt `hau_mono_struc`

---

## 💡 VÍ DỤ SỬ DỤNG

### User yêu cầu:
> "Tạo trang quản lý seminar cho admin"

### AI xử lý theo command này:

**1. Phân tích:**
- Loại: list + detail (CRUD seminar)
- Role: admin → route group `(admin)`
- Scope: route-specific

**2. Vị trí file:**
```text
app/[locale]/(admin)/admin/seminar/
├── page.tsx                              # Orchestrate
├── components/features/
│   ├── SeminarList/
│   │   ├── page.tsx                      # Feature compose
│   │   └── components/
│   │       ├── SeminarListHeader.tsx      # Search + filter + create button
│   │       ├── SeminarTable.tsx           # TanStack Table
│   │       └── SeminarTableColumns.tsx    # Column definitions
│   ├── SeminarDetail/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── SeminarInfo.tsx
│   │       └── SeminarMemberTable.tsx
│   └── shared.ts                         # Types, constants chung
```

**3. UI choices:**
- Table: Shadcn DataTable + TanStack
- Header: Shadcn Input (search) + Button + Badge
- Cards: glassmorphism pattern
- Animation: fadeUp entrance + stagger cho table rows
- Skeleton: table skeleton loading
- Dark mode: full support

**4. API:**
```text
lib/api/services/fetchSeminar.ts          # CRUD seminar API
hooks/useSeminar.ts                       # React Query hooks
```

**5. i18n:**
```text
messages/en/seminar.json
messages/vi/seminar.json
```

---

## ⚠️ NGUYÊN TẮC XUNG ĐỘT

Khi 2 skill có quy tắc khác nhau về cùng 1 vấn đề:

| Vấn đề | Skill ưu tiên |
|---|---|
| File đặt ở đâu | **Structure** quyết định |
| Tách component thế nào | **Structure** quyết định |
| Chọn thư viện UI nào | **UI** quyết định |
| Animation pattern | **UI** quyết định |
| Tailwind config | **UI** quyết định |
| API layer pattern | **Structure** quyết định |
| Provider thứ tự | **Structure** quyết định |
| TypeScript types | **Cả hai** đều yêu cầu |
| i18n | **Structure** quyết định đặt đâu, **UI** quyết định hiển thị |