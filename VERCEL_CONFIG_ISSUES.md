# 🔧 VẤN ĐỀ CẤU HÌNH PROJECT TRÊN VERCEL

## 📋 CÁC VẤN ĐỀ CẤU HÌNH PHỔ BIẾN GÂY LỖI "INTERNAL ERROR"

### 1. ⚠️ Build Settings Không Đúng

#### Vấn đề:
- **Framework Preset**: Không detect đúng Next.js
- **Build Command**: Sai hoặc không có
- **Output Directory**: Sai path
- **Install Command**: Không đúng

#### Cách kiểm tra:
Vào **Vercel Dashboard** > **Project Settings** > **Build & Development Settings**

#### Cấu hình ĐÚNG cho Next.js:
```
Framework Preset: Next.js
Build Command: npm run build (hoặc để trống - Vercel tự detect)
Output Directory: .next (hoặc để trống - Vercel tự detect)
Install Command: npm install (hoặc để trống)
Root Directory: . (hoặc để trống nếu project ở root)
```

#### Cấu hình SAI thường gặp:
```
❌ Build Command: next build (thiếu npm run)
❌ Output Directory: out (sai - Next.js dùng .next)
❌ Framework Preset: Other (không detect Next.js)
```

---

### 2. ⚠️ Environment Variables

#### Vấn đề:
- **Thiếu environment variables** cần thiết
- **Format sai** (có space, quotes không đúng)
- **Value rỗng** hoặc **null**
- **Chưa set cho Production environment**

#### Cách kiểm tra:
Vào **Vercel Dashboard** > **Project Settings** > **Environment Variables**

#### Các biến CẦN THIẾT cho project này:
```
NEXT_PUBLIC_API_URL_CORE=https://localhost:8002
NEXT_PUBLIC_API_URL_AUTH=https://localhost:8001
NEXT_PUBLIC_API_URL_API_GATEWAY=https://your-gateway-url
```

#### Lưu ý:
- ✅ Phải có prefix `NEXT_PUBLIC_` cho client-side variables
- ✅ Set cho cả **Production**, **Preview**, và **Development**
- ✅ Không có space ở đầu/cuối value
- ✅ Không cần quotes cho string values

---

### 3. ⚠️ Node.js Version

#### Vấn đề:
- **Version không khớp** với `.nvmrc` hoặc `package.json`
- **Version quá cũ** hoặc **quá mới** (không được hỗ trợ)
- **Không set version** → Vercel dùng version mặc định (có thể không đúng)

#### Cách kiểm tra:
Vào **Vercel Dashboard** > **Project Settings** > **General** > **Node.js Version**

#### Cấu hình ĐÚNG:
- File `.nvmrc` có nội dung: `20`
- Hoặc set trong Vercel Dashboard: **20.x**

#### Version được hỗ trợ:
- ✅ Node.js 18.x
- ✅ Node.js 20.x (khuyến nghị)
- ❌ Node.js 16.x (deprecated)
- ❌ Node.js 22.x (có thể chưa stable)

---

### 4. ⚠️ Output Directory Size

#### Vấn đề:
- **Build output quá lớn** (>50-100MB)
- **Có file không cần thiết** trong output
- **.next/dev folder** được include (development cache)

#### Cách kiểm tra:
Sau khi build, check size:
```bash
# Windows PowerShell
Get-ChildItem -Path ".next" -Recurse | Measure-Object -Property Length -Sum
```

#### Giới hạn:
- ⚠️ **Warning**: >50MB
- ❌ **Error**: >100MB (có thể gây "internal error")

#### Giải pháp:
- ✅ Xóa `.next/dev` folder (development cache)
- ✅ Optimize images
- ✅ Exclude files không cần thiết trong `.gitignore`

---

### 5. ⚠️ Regions Configuration

#### Vấn đề:
- **Region không tồn tại** hoặc **không available**
- **Region code sai** (ví dụ: `sin1` vs `sin`)
- **Conflict** giữa `vercel.json` và Dashboard settings

#### Cách kiểm tra:
Vào **Vercel Dashboard** > **Project Settings** > **General** > **Regions**

#### Regions hợp lệ:
- `iad1` - Washington, D.C., USA
- `sfo1` - San Francisco, USA
- `hnd1` - Tokyo, Japan
- `sin1` - Singapore ✅ (đang dùng)
- `syd1` - Sydney, Australia
- `fra1` - Frankfurt, Germany

#### Lưu ý:
- ✅ Có thể set nhiều regions: `["sin1", "iad1"]`
- ✅ Để trống = dùng region mặc định (gần user nhất)
- ❌ Không set region không tồn tại

---

### 6. ⚠️ Functions Configuration

#### Vấn đề:
- **maxDuration quá lớn** (>60s cho Hobby plan)
- **Memory setting** (không còn được hỗ trợ với Active CPU billing)
- **Pattern không đúng** với Next.js App Router

#### Cách kiểm tra:
File `vercel.json` (nếu có):
```json
{
  "functions": {
    "app/**/*.tsx": {
      "maxDuration": 10  // ✅ OK
    }
  }
}
```

#### Lưu ý:
- ✅ Hobby plan: maxDuration tối đa 10s
- ✅ Pro plan: maxDuration tối đa 60s
- ❌ Không dùng `memory` setting (deprecated)

---

### 7. ⚠️ Root Directory

#### Vấn đề:
- **Project không ở root** của repository
- **Root Directory sai** → Vercel không tìm thấy `package.json`

#### Cách kiểm tra:
Vào **Vercel Dashboard** > **Project Settings** > **General** > **Root Directory**

#### Cấu hình ĐÚNG:
- Nếu project ở root: để **trống** hoặc `.`
- Nếu project ở subfolder: set path (ví dụ: `apps/web`)

---

### 8. ⚠️ Git Integration

#### Vấn đề:
- **Branch không được connect** đúng
- **Production Branch** sai
- **Auto-deploy** bị tắt

#### Cách kiểm tra:
Vào **Vercel Dashboard** > **Project Settings** > **Git**

#### Cấu hình ĐÚNG:
- **Production Branch**: `main` (hoặc `master`)
- **Auto-deploy**: ✅ Enabled
- **Repository**: Đúng repo và owner

---

## 🔍 CÁCH KIỂM TRA VÀ SỬA

### Bước 1: Kiểm tra Build Settings
```
Vercel Dashboard > Project Settings > Build & Development Settings

✅ Framework Preset: Next.js
✅ Build Command: npm run build (hoặc để trống)
✅ Output Directory: .next (hoặc để trống)
✅ Install Command: npm install (hoặc để trống)
```

### Bước 2: Kiểm tra Environment Variables
```
Vercel Dashboard > Project Settings > Environment Variables

✅ Tất cả NEXT_PUBLIC_* variables đã được set
✅ Set cho Production, Preview, Development
✅ Không có space, quotes đúng cách
```

### Bước 3: Kiểm tra Node.js Version
```
Vercel Dashboard > Project Settings > General > Node.js Version

✅ Version: 20.x (khớp với .nvmrc)
```

### Bước 4: Kiểm tra Regions
```
Vercel Dashboard > Project Settings > General > Regions

✅ Region hợp lệ (sin1, iad1, etc.)
✅ Hoặc để trống (dùng mặc định)
```

### Bước 5: Clear Build Cache
```
Vercel Dashboard > Project Settings > General > Clear Build Cache

✅ Click "Clear Build Cache"
✅ Deploy lại
```

---

## 🎯 CHECKLIST TRƯỚC KHI DEPLOY

- [ ] Framework Preset = Next.js
- [ ] Build Command = `npm run build` hoặc để trống
- [ ] Output Directory = `.next` hoặc để trống
- [ ] Node.js Version = 20.x (khớp với .nvmrc)
- [ ] Tất cả Environment Variables đã được set
- [ ] Regions hợp lệ (hoặc để trống)
- [ ] Root Directory đúng (hoặc để trống nếu ở root)
- [ ] Production Branch = `main`
- [ ] Auto-deploy = Enabled
- [ ] Build output size < 50MB

---

## 🚨 NẾU VẪN LỖI SAU KHI CHECK TẤT CẢ

1. **Clear Build Cache** trong Vercel Dashboard
2. **Cancel deployment hiện tại** và trigger lại
3. **Kiểm tra Vercel Status Page**: https://www.vercel-status.com/
4. **Liên hệ Vercel Support** với:
   - Build logs
   - Error message
   - Project configuration screenshots
