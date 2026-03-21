# API Calls Inventory

Tai lieu nay tong hop tat ca API endpoint dang duoc call trong frontend client.

## Base URL dang su dung

- `api8080Service`: `NEXT_PUBLIC_API_URL_API_GATEWAY`
- `apiService`: `NEXT_PUBLIC_API_URL_BACKEND` (co tao instance, hien tai khong thay endpoint cu the goi truc tiep)
- `authApiService`: `NEXT_PUBLIC_API_URL_AUTH` (co tao instance, hien tai khong thay endpoint cu the goi truc tiep)
- `coreApiService`: `NEXT_PUBLIC_API_URL_CORE` (co tao instance, hien tai khong thay endpoint cu the goi truc tiep)
- `aiApiService`: `NEXT_PUBLIC_API_URL_API_GATEWAY` (co tao instance, hien tai khong thay endpoint cu the goi truc tiep)

## Auth

| Method | Endpoint |
|---|---|
| POST | `/api/v1/auth/login` |
| POST | `/api/v1/auth/register` |
| POST | `/api/v1/auth/verify-otp` |
| GET | `/api/v1/users/me` |
| POST | `/api/v1/auth/forgot-password` |
| POST | `/api/v1/auth/reset-password` |

## Users

| Method | Endpoint |
|---|---|
| GET | `/api/v1/users` |
| GET | `/api/v1/users/{id}` |

## Vehicle Types

| Method | Endpoint |
|---|---|
| GET | `/api/v1/types` |
| POST | `/api/v1/types` |
| PUT | `/api/v1/types/{id}` |
| DELETE | `/api/v1/types/{id}` |

## Brands

| Method | Endpoint |
|---|---|
| GET | `/api/v1/brands` |
| GET | `/api/v1/brands/types/{typeId}` |
| POST | `/api/v1/brands` |
| POST | `/api/v1/brands/bulk` |
| POST | `/api/v1/brands/bulk/upload` |
| PUT | `/api/v1/brands/{id}` |
| DELETE | `/api/v1/brands/{id}` |

## Models

| Method | Endpoint |
|---|---|
| GET | `/api/v1/models` |
| GET | `/api/v1/models/{id}` |
| POST | `/api/v1/models` |
| PUT | `/api/v1/models/{id}` |
| DELETE | `/api/v1/models/{id}` |

## Variants

| Method | Endpoint |
|---|---|
| GET | `/api/v1/variants/model/{vehicleModelId}` |
| POST | `/api/v1/variants` |
| PUT | `/api/v1/variants/{id}` |
| DELETE | `/api/v1/variants/{id}` |

## User Vehicles

| Method | Endpoint |
|---|---|
| POST | `/api/v1/user-vehicles` |
| GET | `/api/v1/user-vehicles` |
| DELETE | `/api/v1/user-vehicles/{id}` |
| GET | `/api/v1/user-vehicles/{userVehicleId}/parts` |
| POST | `/api/v1/user-vehicles/{userVehicleId}/apply-tracking` |
| GET | `/api/v1/user-vehicles/{userVehicleId}/reminders` |
| PATCH | `/api/v1/user-vehicles/{userVehicleId}/odometer` |
| GET | `/api/v1/user-vehicles/{userVehicleId}/odometer-history` |

## AI

| Method | Endpoint |
|---|---|
| POST | `/api/v1/ai/vehicle-questionnaire/analyze` |
| POST (upload) | `/api/v1/ai/odometer/scan` |

## Notifications

| Method | Endpoint |
|---|---|
| GET | `/api/v1/notifications/status` |
| GET | `/api/v1/notifications` |
| GET | `/api/v1/notifications/{id}` |
| POST | `/api/v1/notifications/read-all` |
| POST | `/api/v1/notifications/{id}/read` |

## Part Categories

| Method | Endpoint |
|---|---|
| GET | `/api/v1/parts/categories` |
| GET | `/api/v1/parts/categories/{id}` |
| GET | `/api/v1/parts/categories/user-vehicle/{vehicleId}` |
| POST | `/api/v1/parts/categories` |
| PUT | `/api/v1/parts/categories/{id}` |
| DELETE | `/api/v1/parts/categories/{id}` |

## Part Products

| Method | Endpoint |
|---|---|
| GET | `/api/v1/parts/products/category/{categoryId}` |
| GET | `/api/v1/parts/products/{id}` |
| POST | `/api/v1/parts/products` |
| PUT | `/api/v1/parts/products/{id}` |
| DELETE | `/api/v1/parts/products/{id}` |

## Maintenance Records

| Method | Endpoint |
|---|---|
| POST | `/api/v1/maintenance-records/vehicles/{userVehicleId}` |
| GET | `/api/v1/maintenance-records/vehicles/{userVehicleId}` |
| GET | `/api/v1/maintenance-records/{maintenanceRecordId}` |

## Ghi chu

- Danh sach nay duoc tong hop tu cac file trong `lib/api/services`.
- Cac endpoint co placeholder `{...}` la dynamic route param.
- Mot so API co query params (vi du `PageNumber`, `PageSize`, `IsDescending`) duoc truyen them tuy context.
