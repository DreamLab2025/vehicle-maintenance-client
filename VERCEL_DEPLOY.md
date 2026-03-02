# Vercel Deployment Guide

## Environment Variables Required

Đảm bảo bạn đã thêm các environment variables sau trong Vercel Dashboard (Settings > Environment Variables):

### Required Variables:
```
NEXT_PUBLIC_API_URL_API_GATEWAY=https://your-api-gateway-url
NEXT_PUBLIC_API_URL_CORE=https://your-core-api-url
NEXT_PUBLIC_API_URL_AUTH=https://your-auth-api-url
NEXT_PUBLIC_API_URL_BACKEND=https://your-backend-url (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key (optional, nếu dùng map feature)
```

## Build Settings

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`
- **Node Version**: 20.x (có thể set trong Vercel Dashboard > Settings > General > Node.js Version, hoặc tạo file `.nvmrc` với nội dung `20`)

## Troubleshooting

### Lỗi "We encountered an internal error"

Lỗi này thường xảy ra sau khi build thành công, có thể do:

1. **Lỗi tạm thời của Vercel**: 
   - Đợi 5-10 phút rồi thử deploy lại
   - Kiểm tra [Vercel Status Page](https://www.vercel-status.com/)

2. **Vấn đề với vercel.json**:
   - Thử xóa file `vercel.json` hoàn toàn để Vercel tự detect
   - Hoặc đơn giản hóa chỉ còn `{"regions": ["sin1"]}`
   - Functions config có thể gây conflict với Next.js App Router

3. **Kiểm tra Environment Variables**: 
   - Đảm bảo tất cả env vars đã được thêm vào Vercel Dashboard
   - Kiểm tra format (không có space, quotes đúng cách)

4. **Kiểm tra Build Output Size**:
   - Nếu build output quá lớn (>50MB), có thể gây lỗi
   - Kiểm tra `.next` folder size

5. **Thử các giải pháp khác**:
   - Cancel deployment hiện tại và trigger lại
   - Xóa cache trong Vercel Dashboard > Settings > General
   - Thử deploy từ branch khác để test

### Common Issues

- **Build timeout**: Tăng `maxDuration` trong vercel.json nếu cần
- **Memory setting warning**: Đã xóa `memory` setting vì không còn được hỗ trợ với Active CPU billing
- **Missing env vars**: App sẽ crash nếu thiếu required env vars
- **Internal error on deploy**: Thường là lỗi tạm thời, thử deploy lại sau vài phút

## Next Steps

1. Thêm tất cả environment variables vào Vercel Dashboard
2. Trigger lại deployment
3. Kiểm tra Build Logs nếu vẫn lỗi
