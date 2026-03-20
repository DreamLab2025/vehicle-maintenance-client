# Research Hub - Project Structure

Tai lieu nay tong quat cau truc du an `research-hub-client` de ban co the dung lai bo khung nhanh va dung chuan.

## 1) Tong quan cong nghe

- Framework: Next.js App Router
- Ngon ngu: TypeScript
- UI: Tailwind CSS + shadcn/radix components
- State: Redux Toolkit + React Query
- Realtime: SignalR
- i18n: `next-intl` (ho tro `en`, `vi`)

## 2) Cay thu muc chinh (rut gon)

```text
research-hub-client/
|-- app/
|   |-- [locale]/
|   |   |-- (admin)/
|   |   |   `-- admin/
|   |   |       |-- components/features/
|   |   |       `-- layout.tsx
|   |   |-- (auth)/
|   |   |   `-- login/
|   |   |-- (department_head)/
|   |   |   `-- department-head/
|   |   |-- (project)/
|   |   |   `-- project/
|   |   |       |-- [id]/
|   |   |       `-- components/
|   |   |-- (student)/
|   |   |-- manage-project/
|   |   `-- layout.tsx
|   |-- favicon.ico
|   `-- globals.css
|
|-- components/
|   |-- layout/
|   |-- ui/
|   `-- widget/
|
|-- hooks/
|-- i18n/
|-- lib/
|   |-- api/
|   |   |-- core.ts
|   |   `-- services/
|   |-- providers/
|   |-- realtime/
|   |-- redux/
|   |-- types/
|   `-- utils/
|
|-- messages/
|   |-- en/
|   `-- vi/
|
|-- public/
|-- types/
|-- utils/
|
|-- Dockerfile
|-- next.config.ts
|-- package.json
`-- tsconfig.json
```

## 3) Vai tro tung khu vuc

### `app/` - Route va man hinh

- Dung App Router cua Next.js.
- Route duoc chia theo role bang route groups:
  - `(admin)` -> cac man quan tri
  - `(auth)` -> dang nhap/xac thuc
  - `(department_head)` -> tinh nang truong bo mon
  - `(project)` -> tinh nang de tai/du an
  - `(student)` -> tinh nang sinh vien
- `[locale]` de ho tro da ngon ngu theo URL.

### `components/` - Thanh phan giao dien dung chung

- `components/ui/`: component UI co ban (button, dialog, table, ...)
- `components/layout/`: AppHeader, AppSidebar, AppLayout
- `components/widget/`: widget theo nghiep vu (auth, department, project, ...)

### `hooks/` - Custom hooks

- Gom hooks cho auth, data fetching, realtime, infinite scroll, ...
- Muc tieu: tach logic khoi component de de tai su dung.

### `lib/` - Tang ha tang cua ung dung

- `lib/api/core.ts`: axios instance + interceptors
- `lib/api/services/`: ham goi API theo module nghiep vu
- `lib/providers/`: provider goc (Redux, Query, SignalR)
- `lib/redux/`: store, slices, typed hooks
- `lib/realtime/`: setup SignalR
- `lib/utils/`: helper dung chung

### `messages/` va `i18n/` - Da ngon ngu

- `messages/en`, `messages/vi`: file json dictionary
- `i18n/routing.ts`, `i18n/request.ts`: config dinh tuyen va locale handling

### `types/` va `utils/` (root)

- `types/`: kieu du lieu dung chung toan app
- `utils/`: helper theo muc dich rieng (vd: cookie config)

## 4) Mau scaffold de dung project moi theo cau truc nay

Neu ban dung moi, co the tao bo khung toi thieu nhu sau:

1. Tao thu muc goc:
   - `app`, `components`, `hooks`, `lib`, `messages`, `public`, `types`, `utils`
2. Trong `app`, tao route group theo role:
   - `app/[locale]/(auth)`, `app/[locale]/(admin)`, `app/[locale]/(department_head)`, `app/[locale]/(project)`, `app/[locale]/(student)`
3. Trong `lib`, tao cac module cot loi:
   - `api/core.ts`, `api/services/*`, `providers/*`, `redux/*`, `realtime/*`
4. Them i18n:
   - `i18n/routing.ts`, `i18n/request.ts`, `messages/en/*.json`, `messages/vi/*.json`
5. Chuan hoa component:
   - `components/ui`, `components/layout`, `components/widget`

## 5) Nguyen tac to chuc de de mo rong

- Tach route theo role de tranh xung dot quyen truy cap.
- Dat logic giao tiep server trong `lib/api/services`, khong goi truc tiep trong UI.
- Dung hook de gom logic tai su dung.
- Duy tri dictionary i18n theo cung key giua `en` va `vi`.
- Tach ro `components/ui` (generic) va `components/widget` (business-specific).

## 6) Nguyen tac tach components (theo dung style project nay)

### Muc tieu

- UI de test, de tai su dung, de doc.
- Moi component co 1 trach nhiem ro rang.
- Tranh file `page.tsx` qua lon (chi nen lam orchestration).

### Quy uoc tach theo cap

1. `page.tsx`
   - Chi xu ly flow man hinh: lay params, chon feature, compose layout.
   - Khong viet UI chi tiet qua nhieu tai day.
2. `components/features/<FeatureName>/page.tsx`
   - Dai dien cho 1 feature lon trong route (Overview, Progress, Seminar...).
   - Co the tiep tuc tach nho xuong `components/` ben trong feature.
3. `components/features/<FeatureName>/components/*`
   - Cac block UI con cua feature: header, table, card, chart, form.
4. `components/features/shared.ts` hoac `shared/`
   - Chua constants/types/helpers duoc dung chung giua nhieu feature cung route.

### Khi nao dat component o dau

- Dat o `app/.../components/features/...` khi:
  - Chi dung trong 1 route hoac 1 feature cu the.
- Dat o `components/widget/<domain>/` khi:
  - Dung lai giua nhieu route nhung van gan nghiep vu (project, auth, department...).
- Dat o `components/ui/` khi:
  - La UI primitive, khong chua business logic (Button, Dialog, Table, Tabs...).
- Dat o `components/layout/` khi:
  - La khung bo cuc cap app/section (Header, Sidebar, main layout wrappers).

### Quy tac dat ten

- Component file: PascalCase (`ProjectHeader.tsx`, `SeminarMemberTable.tsx`).
- Feature folder: PascalCase hoac ten nghiep vu ro nghia (`Overview`, `SeminarQuestion`).
- Hook: camelCase bat dau bang `use` (`useProject.ts`, `useUsers.ts`).
- Service API: `fetch<Domain>.ts` (`fetchProject.ts`, `fetchUsers.ts`).

### Pattern de ap dung nhanh cho feature moi

```text
components/features/NewFeature/
|-- page.tsx
|-- components/
|   |-- NewFeatureHeader.tsx
|   |-- NewFeatureTable.tsx
|   `-- NewFeatureForm.tsx
`-- types.ts (optional)
```

- `page.tsx` cua feature chi compose:
  - Goi hooks/service can thiet
  - Truyen props cho cac component con
- Logic nho theo tung khoi:
  - Validation form -> tach rieng
  - Column table -> tach rieng
  - Modal/dialog -> component rieng

### Gioi han de tranh "god component"

- 1 component > ~200-250 dong va xu ly nhieu muc dich -> nen tach.
- 1 file vua fetch data, vua validate form, vua render bang phuc tap -> tach thanh 2-4 component/hook.
- Uu tien "container + presentational":
  - Container: xu ly data/side effects
  - Presentational: nhan props va render UI

## 7) Doi chieu them voi `SETUP.md` (de dung project dung chuan)

### Thu tu Providers (quan trong)

- Nen giu dung thu tu:
  - `ReduxProvider` -> `QueryProvider` -> `SignalRProvider` -> `AuthSyncProvider`
- Ly do:
  - SignalR can auth state tu Redux
  - Query cache/doc lap voi global state, nhung van nam trong app context
  - Auth sync theo tab can dispatch vao Redux

### Pattern API layer nen giu nguyen

- `lib/api/core.ts`:
  - Axios singleton
  - Request interceptor dinh kem bearer token
  - Response interceptor xu ly `401` + refresh token queue + retry request cu
- `lib/api/services/fetchXxx.ts`:
  - Moi domain 1 file (`fetchAuth`, `fetchProject`, `fetchUsers`...)
  - Service tra ve typed response, khong render/toast trong service

### Pattern state/auth nen giu nguyen

- `lib/redux/slices/authSlice.ts`:
  - `role` o dang `string[]`
  - Co `refreshToken` trong state
  - Co co che `setupAutoRefresh` truoc han token
- `hooks/useAuth.ts`:
  - Xu ly login/logout + role-based redirect
  - UI page goi hook, tranh goi truc tiep service + dispatch lan tron

### Realtime pattern nen giu nguyen

- `lib/realtime/signalr.ts`:
  - Dung 1 singleton connection
  - Co `startHubConnection`/`stopHubConnection`
- `hooks/useSignalR.ts` + `hooks/useSignalRNotifications.ts`:
  - Tach ket noi va lang nghe event thanh 2 hook rieng
  - Dat trong `SignalRProvider` de app chi mo 1 kenh realtime

### i18n va route group

- Duy tri `app/[locale]` cho toan bo route business.
- Role routes nen dong bo theo nhom:
  - `(admin)`, `(auth)`, `(department_head)`, `(project)`, `(student)`
- Dictionary dat tai `messages/en` va `messages/vi` voi cung key structure.

### Checklist scaffold toi thieu (rut ra tu `SETUP.md`)

1. Tao khung thu muc: `app`, `components`, `lib`, `hooks`, `types`, `utils`, `messages`.
2. Tao core files:
   - `lib/api/core.ts`
   - `lib/redux/store.ts`, `lib/redux/hooks.ts`, `lib/redux/slices/authSlice.ts`
   - `lib/providers/{reduxProvider,queryProvider,signalRProvider,index}.tsx`
   - `lib/realtime/signalr.ts`
3. Tao hooks xuong song:
   - `useAuth`, `useSignalR`, `useSignalRNotifications`, `useAuthSyncAcrossTabs`
4. Tao i18n:
   - `i18n/routing.ts`, `i18n/request.ts`, `messages/en/*.json`, `messages/vi/*.json`
5. Tao layer UI:
   - `components/ui`, `components/layout`, `components/widget`
6. Chot code quality:
   - lint + type-check + format

### Ghi chu khi copy setup sang project moi

- Project nay dang chay port `5174` (theo scripts hien tai cua repo), can giu dong bo neu clone setup.
- Tailwind dang theo v4 pattern (`@tailwindcss/postcss`, khong bat buoc `tailwind.config.ts`).
- Neu ban dung middleware RBAC, uu tien decode role array + xu ly token het han ngay tai middleware.

