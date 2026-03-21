# API Changes — Frontend Migration Guide

> Updated: 2026-03-21 · Covers Vehicle service and Identity service.

---

## Migration Checklist

- [ ] Update odometer route: `/odometer-history/user-vehicle/{id}` → `/odometer-history/{id}` (PATCH) or `?userVehicleId=` (GET)
- [ ] Update brands filter route: `/brands/types/{typeId}` → `/brands?typeId=`
- [ ] Update maintenance-records routes (path param → query param / body)
- [ ] Update part-categories filter route: `/part-categories/user-vehicle/{id}` → `/part-categories?userVehicleId=`
- [ ] Update reminders route: add `?userVehicleId=` instead of path param
- [ ] Update variants route: `/vehicle-models/{id}` → `/models/{id}/variants`
- [ ] Remove `status` field from PartCategory / PartProduct types
- [ ] Remove `status` field from `UserDto` — use `emailVerified` instead
- [ ] Replace `isCurrent` on reminders with `status` (`"Active"` / `"Passed"`)
- [ ] Replace `vehiclePartTrackingId` on reminders with `trackingCycleId`
- [ ] Replace `reminders[]` on `PartTrackingSummary` with `activeCycle` object
- [ ] Remove `Hybrid` fuel type and `ManualCar` / `AutomaticCar` transmission types from dropdowns

---

## Breaking Changes

### Removed fields

| Type                   | Field removed           | What to use instead                          |
| ---------------------- | ----------------------- | -------------------------------------------- |
| `PartCategoryResponse` | `status`                | Soft-deleted records are never returned      |
| `PartCategorySummary`  | `status`                | Same                                         |
| `PartProductResponse`  | `status`                | Same                                         |
| `PartProductSummary`   | `status`                | Same                                         |
| `UserDto`              | `status`                | `emailVerified: boolean` (already existed)   |
| `ReminderSummary`      | `isCurrent`             | `status: "Active" \| "Passed"`               |
| `ReminderDetailDto`    | `isCurrent`             | `status: "Active" \| "Passed" \| "Resolved"` |
| `ReminderDetailDto`    | `vehiclePartTrackingId` | `trackingCycleId`                            |

### Removed enum values

**`fuelTypeName`** — valid values:

- `"Xăng"` (Gasoline)
- `"Dầu Diesel"` (Diesel)
- ~~`"Hybrid"`~~ — removed

**`transmissionTypeName`** — valid values:

- `"Xe số"` (Manual)
- `"Tay ga"` (Automatic)
- `"Xe côn"` (Sport)
- ~~`"Số sàn"`~~ — removed
- ~~`"Số tự động"`~~ — removed

### Changed routes

| Method  | Old route                                             | New route                                              |
| ------- | ----------------------------------------------------- | ------------------------------------------------------ |
| `PATCH` | `/odometer-history/user-vehicle/{id}`                 | `/odometer-history/{id}`                               |
| `GET`   | `/odometer-history/user-vehicle/{id}`                 | `/odometer-history?userVehicleId={id}`                 |
| `GET`   | `/brands/types/{typeId}`                              | `/brands?typeId={typeId}`                              |
| `GET`   | `/maintenance-records/vehicles/{id}`                  | `/maintenance-records?userVehicleId={id}`              |
| `POST`  | `/maintenance-records/vehicles/{id}`                  | `/maintenance-records` (id in body)                    |
| `GET`   | `/part-categories/user-vehicle/{id}`                  | `/part-categories?userVehicleId={id}`                  |
| `GET`   | `/part-categories/{code}/reminders/user-vehicle/{id}` | `/part-categories/{code}/reminders?userVehicleId={id}` |
| `GET`   | `/vehicle-models/{modelId}` _(variants)_              | `/models/{id}/variants`                                |

---

## PartTrackingSummary — activeCycle replaces reminders[]

`GET /api/v1/user-vehicles/{id}/parts` — each item now has `activeCycle` instead of `reminders[]`.

**Before:**

```json
{
  "id": "guid",
  "partCategoryCode": "OIL",
  "isDeclared": true,
  "reminders": [
    {
      "id": "guid",
      "level": "Critical",
      "isCurrent": true,
      "currentOdometer": 15000,
      "targetOdometer": 14500,
      "remainingKm": -500,
      "targetDate": "2026-01-01",
      "percentageRemaining": 0
    }
  ]
}
```

**After:**

```json
{
  "id": "guid",
  "partCategoryCode": "OIL",
  "isDeclared": true,
  "activeCycle": {
    "id": "guid",
    "status": "Active",
    "startOdometer": 12500,
    "startDate": "2025-10-01",
    "targetOdometer": 14500,
    "targetDate": "2026-01-01",
    "reminders": [
      {
        "id": "guid",
        "level": "Critical",
        "status": "Active",
        "currentOdometer": 15000,
        "targetOdometer": 14500,
        "remainingKm": -500,
        "targetDate": "2026-01-01",
        "percentageRemaining": 0,
        "isNotified": true,
        "notifiedDate": "2025-12-25",
        "isDismissed": false,
        "dismissedDate": null
      }
    ]
  }
}
```

`activeCycle` is `null` when the part has not been set up.

**Status values:**

- `ReminderSummary.status`: `"Active"` (current threshold), `"Passed"` (superseded within cycle), `"Resolved"` (cycle ended by replacement)
- `TrackingCycleSummary.status`: `"Active"`, `"Completed"`

---

## New Endpoints

### `GET /api/v1/user-vehicles/{userVehicleId}/parts/{partTrackingId}/cycles`

All tracking cycles for a part — newest first. Use for displaying service history per part.

**Response `200`:**

```json
{
  "data": [
    {
      "id": "guid",
      "status": "Active",
      "startOdometer": 12500,
      "startDate": "2025-10-01",
      "targetOdometer": 14500,
      "targetDate": "2026-01-01",
      "reminders": [ ... ]
    },
    {
      "id": "guid",
      "status": "Completed",
      "startOdometer": 0,
      "startDate": "2025-01-01",
      "targetOdometer": 12500,
      "targetDate": "2025-10-01",
      "reminders": [ ... ]
    }
  ]
}
```

**`404`** — vehicle or part not found / not owned by user.

### `GET /api/v1/brands/{id}` — NEW

Returns full brand detail: `id`, `vehicleTypeId`, `vehicleTypeName`, `name`, `logoUrl`, `website`, `supportPhone`, `createdAt`, `updatedAt`.

### `GET /api/v1/types/{id}` — NEW

Returns full vehicle type detail.

### `GET /api/v1/vehicle-models/{id}/part-categories` — NEW

Returns `PartCategoryResponse[]` — active categories for a specific model. Replaces the removed default-schedule endpoint.

---

## Request Body Changes

### `POST /api/v1/maintenance-records`

`userVehicleId` moved from path into the request body:

```json
{
  "userVehicleId": "guid",
  "serviceDate": "2025-03-21",
  "odometerAtService": 12000,
  "garageName": "Garage ABC",
  "totalCost": 500000,
  "notes": "string",
  "invoiceImageUrl": "string",
  "items": [
    {
      "partCategoryCode": "OIL_FILTER",
      "partProductId": "guid | null",
      "customPartName": "string",
      "customKmInterval": 3000,
      "customMonthsInterval": 3,
      "instanceIdentifier": "string",
      "price": 120000,
      "itemNotes": "string",
      "updatesTracking": true
    }
  ]
}
```

---

## Response Shapes (Reference)

### `PartCategorySummary`

```ts
{
  id: string;
  name: string;
  code: string;
  iconUrl: string;
  displayOrder: number;
}
```

### `PartProductSummary`

```ts
{
  id: string;
  partCategoryId: string;
  partCategoryName: string;
  name: string;
  brand: string;
  imageUrl: string;
  referencePrice: number;
}
```

### `ModelSummary`

```ts
{
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  typeId: string;
  typeName: string;
  releaseYear: number;
  fuelTypeName: string;
  transmissionTypeName: string;
}
```

### `TypeSummary`

```ts
{
  id: string;
  name: string;
  imageUrl: string;
}
```

### `BrandSummary`

```ts
{
  id: string;
  vehicleTypeId: string;
  vehicleTypeName: string;
  name: string;
  logoUrl: string;
}
```

### `OdometerHistoryItem`

```ts
{
  id: string;
  userVehicleId: string;
  odometerValue: number;
  recordedDate: string;
  kmOnRecordedDate: number;
  source: "ManualInput";
}
```

### `ReminderDetailDto`

```ts
{
  id: string;
  trackingCycleId: string;
  level: "Warning" | "Critical";
  status: "Active" | "Passed" | "Resolved";
  currentOdometer: number;
  targetOdometer: number;
  remainingKm: number;
  targetDate: string;
  percentageRemaining: number;
  isNotified: boolean;
  notifiedDate: string | null;
  isDismissed: boolean;
  dismissedDate: string | null;
  partCategory: {
    id: string;
    name: string;
    code: string;
    description: string;
    iconUrl: string;
    identificationSigns: string;
    consequencesIfNotHandled: string;
  }
}
```

---

## Unchanged Endpoints

| Endpoint                                               | Notes                                 |
| ------------------------------------------------------ | ------------------------------------- |
| `GET /api/v1/user-vehicles`                            |                                       |
| `GET /api/v1/user-vehicles/{id}`                       |                                       |
| `POST /api/v1/user-vehicles`                           |                                       |
| `PUT /api/v1/user-vehicles/{id}`                       |                                       |
| `DELETE /api/v1/user-vehicles/{id}`                    |                                       |
| `GET /api/v1/user-vehicles/{id}/parts`                 | shape changed — see activeCycle above |
| `GET /api/v1/user-vehicles/{id}/reminders`             | `ReminderDetailDto[]` — shape updated |
| `GET /api/v1/user-vehicles/{id}/streak`                |                                       |
| `POST /api/v1/user-vehicles/{id}/apply-tracking`       |                                       |
| `PATCH /api/v1/user-vehicles/{id}/complete-onboarding` |                                       |
| `GET /api/v1/user-vehicles/is-allowed-create`          |                                       |
| `GET /api/v1/part-categories`                          |                                       |
| `GET /api/v1/part-categories/{id}`                     |                                       |
| `GET /api/v1/part-products/category/{categoryId}`      |                                       |
| `GET /api/v1/part-products/{id}`                       |                                       |
| `GET /api/v1/models`                                   |                                       |
| `GET /api/v1/models/{id}`                              | returns full model + variants         |
| `GET /api/v1/types`                                    |                                       |
| `GET /api/v1/brands`                                   |                                       |
| `GET /api/v1/maintenance-records/{id}`                 |                                       |
| `PATCH /api/v1/odometer-history/{id}`                  | route changed — see above             |
