# SignalR Notification Hub - Documentation

## 📋 Tổng quan

SignalR Hub đã được tích hợp để nhận thông báo real-time từ backend. Khi user login, hệ thống sẽ tự động kết nối đến `/hubs/notifications` với JWT authentication.

## 🏗️ Kiến trúc

```
User Login
    ↓
AuthProvider initializes
    ↓
NotificationHubProvider wraps app
    ↓
useNotificationHub hook creates connection
    ↓
SignalR connects to /hubs/notifications with JWT
    ↓
Real-time notifications flow
```

## 📁 Files đã tạo

### 1. `lib/config/signalr.config.ts`
**Chức năng**: Core configuration cho SignalR connection

**Exports**:
- `createNotificationHubConnection()` - Tạo HubConnection với JWT
- `startHubConnection()` - Start connection với error handling
- `stopHubConnection()` - Stop connection gracefully
- `HubEvents` - Event names cho hub

**Features**:
- ✅ JWT authentication từ cookies
- ✅ Automatic reconnect với exponential backoff
- ✅ WebSockets + ServerSentEvents fallback
- ✅ Connection state logging

### 2. `hooks/useNotificationHub.ts`
**Chức năng**: Custom hook để manage SignalR connection

**Returns**:
- `connection` - HubConnection instance
- `isConnected` - Boolean connection status
- `connectionState` - Current state (Connecting, Connected, Disconnected, etc.)
- `onReceiveNotification()` - Register handler cho notifications mới
- `onNotificationRead()` - Register handler khi notification được đọc
- `onNotificationDeleted()` - Register handler khi notification bị xóa
- `markAsRead()` - Gửi event mark as read
- `deleteNotification()` - Gửi event delete notification
- `off()` - Unregister event handler

**Auto-connect logic**:
- ✅ Chỉ connect khi user đã login
- ✅ Auto disconnect khi user logout
- ✅ Cleanup connection on unmount

### 3. `app/(auth)/providers/NotificationHubProvider.tsx`
**Chức năng**: Context Provider để share hub instance across app

**Usage**: Wrap trong Providers (đã setup)

### 4. `lib/providers.tsx`
**Đã update**: Thêm NotificationHubProvider vào provider tree

**Order**:
```tsx
QueryClientProvider
  → I18nProvider
    → AuthProvider
      → NotificationHubProvider 👈 Mới thêm
        → {children}
```

## 🔧 Environment Variables

Đã có trong `.env.local`:
```bash
NEXT_PUBLIC_API_URL_API_GATEWAY=http://localhost:8080
```

Hub URL: `http://localhost:8080/hubs/notifications`

## 🚀 Cách sử dụng

### Basic - Listen for notifications

```tsx
import { useNotificationHubContext } from '@/app/(auth)/providers/NotificationHubProvider';

function MyComponent() {
  const { onReceiveNotification, isConnected } = useNotificationHubContext();

  useEffect(() => {
    if (!isConnected) return;

    const handleNotification = (notification) => {
      console.log('New notification:', notification);
      toast.info(notification.message);
    };

    onReceiveNotification(handleNotification);

    return () => {
      off('ReceiveNotification', handleNotification);
    };
  }, [isConnected]);
}
```

### Mark as read

```tsx
const { markAsRead, isConnected } = useNotificationHubContext();

const handleMarkAsRead = async () => {
  try {
    await markAsRead(notificationId);
    toast.success('Đã đánh dấu là đã đọc');
  } catch (error) {
    toast.error('Lỗi!');
  }
};
```

### Delete notification

```tsx
const { deleteNotification } = useNotificationHubContext();

const handleDelete = async () => {
  try {
    await deleteNotification(notificationId);
    toast.success('Đã xóa');
  } catch (error) {
    toast.error('Lỗi!');
  }
};
```

### Connection status

```tsx
const { isConnected, connectionState } = useNotificationHubContext();

return (
  <div>
    Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}
    State: {connectionState}
  </div>
);
```

## 📡 Hub Events (Backend contract)

### Server → Client (Receive)

| Event Name | Payload | Description |
|------------|---------|-------------|
| `ReceiveNotification` | `Notification` | Thông báo mới |
| `NotificationRead` | `notificationId: string` | Notification đã được đọc |
| `NotificationDeleted` | `notificationId: string` | Notification đã bị xóa |

### Client → Server (Invoke)

| Event Name | Parameters | Description |
|------------|-----------|-------------|
| `MarkAsRead` | `notificationId: string` | Đánh dấu đã đọc |
| `DeleteNotification` | `notificationId: string` | Xóa notification |
| `JoinUserGroup` | - | Join group của user |

## 🔐 Authentication Flow

1. User login → JWT token stored in cookies (`auth-token`)
2. NotificationHubProvider initializes
3. `useNotificationHub` reads token from cookies
4. SignalR connection created with `accessTokenFactory`
5. Token automatically sent with WebSocket handshake
6. Backend validates JWT và authorize connection

## 🔄 Reconnection Strategy

Exponential backoff:
- Retry 1: 0s (immediate)
- Retry 2: 2s
- Retry 3: 10s
- Retry 4+: 30s

Auto-reconnect khi:
- ✅ Network disconnected
- ✅ Server restart
- ✅ Temporary connection loss

## 🐛 Debugging

### Check connection status
```tsx
const { connection, connectionState } = useNotificationHubContext();
console.log('State:', connectionState);
console.log('Connection ID:', connection?.connectionId);
```

### Enable verbose logging
Trong `signalr.config.ts`:
```ts
.configureLogging(signalR.LogLevel.Debug) // Thay Information → Debug
```

### Common issues

**❌ Connection fails immediately**
- Check JWT token in cookies: `document.cookie`
- Verify `NEXT_PUBLIC_API_URL_API_GATEWAY` in `.env.local`
- Check backend hub is running at `/hubs/notifications`

**❌ "401 Unauthorized"**
- Token expired → User cần login lại
- Token không được gửi → Check `accessTokenFactory`

**❌ Connection established nhưng không nhận events**
- Check event name khớp với backend
- Verify handler được register sau khi connected

## 📝 Type Definitions

```typescript
// Notification (example - adjust theo backend)
interface Notification {
  id: string;
  userId: string;
  message: string;
  description?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: string;
}

// Hub Events
const HubEvents = {
  RECEIVE_NOTIFICATION: 'ReceiveNotification',
  NOTIFICATION_READ: 'NotificationRead',
  NOTIFICATION_DELETED: 'NotificationDeleted',
  MARK_AS_READ: 'MarkAsRead',
  DELETE_NOTIFICATION: 'DeleteNotification',
  JOIN_USER_GROUP: 'JoinUserGroup',
} as const;
```

## ✅ Next Steps

### Implement vào UI:
1. ✅ Tích hợp vào `NotificationDropdown.tsx`
2. ✅ Update notification count real-time
3. ✅ Show toast khi có notification mới
4. ✅ Sync với API calls

### Testing:
1. Test với backend đã chạy hub
2. Test reconnection (tắt/bật wifi)
3. Test multiple tabs
4. Test logout → login flow

## 📚 References

- [SignalR JavaScript Client](https://docs.microsoft.com/en-us/aspnet/core/signalr/javascript-client)
- [Hub Protocol](https://docs.microsoft.com/en-us/aspnet/core/signalr/hubs)
- Example file: `lib/config/signalr.example.tsx`

---

**Tạo bởi**: Claude Sonnet 4.5
**Ngày**: 2026-02-10
**Branch**: feat/notification-flow
