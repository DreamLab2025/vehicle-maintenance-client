/**
 * SignalR Notification Hub - Usage Examples
 *
 * This file demonstrates how to use the NotificationHub in your components
 */

import { useEffect } from 'react';
import { useNotificationHubContext } from '@/app/(auth)/providers/NotificationHubProvider';
import { toast } from 'sonner';

/**
 * Example 1: Basic usage - Listen for notifications
 */
export function NotificationListener() {
  const { onReceiveNotification, isConnected, off } = useNotificationHubContext();

  useEffect(() => {
    if (!isConnected) return;

    // Handler function
    const handleNotification = (notification: any) => {
      console.log('📬 New notification received:', notification);

      // Show toast
      toast.info(notification.message, {
        description: notification.description,
        duration: 5000,
      });
    };

    // Register handler
    onReceiveNotification(handleNotification);

    // Cleanup - unregister handler
    return () => {
      off('ReceiveNotification', handleNotification);
    };
  }, [isConnected, onReceiveNotification, off]);

  return null;
}

/**
 * Example 2: Mark notification as read
 */
export function NotificationItem({ notificationId }: { notificationId: string }) {
  const { markAsRead, isConnected } = useNotificationHubContext();

  const handleMarkAsRead = async () => {
    if (!isConnected) {
      toast.error('Không thể kết nối đến server');
      return;
    }

    try {
      await markAsRead(notificationId);
      toast.success('Đã đánh dấu là đã đọc');
    } catch (error) {
      toast.error('Không thể đánh dấu thông báo');
    }
  };

  return (
    <button onClick={handleMarkAsRead}>
      Đánh dấu đã đọc
    </button>
  );
}

/**
 * Example 3: Delete notification
 */
export function DeleteNotificationButton({ notificationId }: { notificationId: string }) {
  const { deleteNotification, isConnected } = useNotificationHubContext();

  const handleDelete = async () => {
    if (!isConnected) {
      toast.error('Không thể kết nối đến server');
      return;
    }

    try {
      await deleteNotification(notificationId);
      toast.success('Đã xóa thông báo');
    } catch (error) {
      toast.error('Không thể xóa thông báo');
    }
  };

  return (
    <button onClick={handleDelete}>
      Xóa thông báo
    </button>
  );
}

/**
 * Example 4: Connection status indicator
 */
export function ConnectionStatus() {
  const { isConnected, connectionState } = useNotificationHubContext();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-sm text-gray-600">
        {isConnected ? 'Đã kết nối' : 'Không kết nối'}
      </span>
      <span className="text-xs text-gray-400">
        ({connectionState})
      </span>
    </div>
  );
}

/**
 * Example 5: Listen for multiple events
 */
export function AdvancedNotificationHandler() {
  const {
    onReceiveNotification,
    onNotificationRead,
    onNotificationDeleted,
    isConnected,
    off,
  } = useNotificationHubContext();

  useEffect(() => {
    if (!isConnected) return;

    // Handler for new notifications
    const handleNewNotification = (notification: any) => {
      console.log('📬 New:', notification);
      toast.info('Thông báo mới!');
    };

    // Handler for read notifications
    const handleRead = (notificationId: string) => {
      console.log('👁️ Read:', notificationId);
    };

    // Handler for deleted notifications
    const handleDeleted = (notificationId: string) => {
      console.log('🗑️ Deleted:', notificationId);
    };

    // Register all handlers
    onReceiveNotification(handleNewNotification);
    onNotificationRead(handleRead);
    onNotificationDeleted(handleDeleted);

    // Cleanup
    return () => {
      off('ReceiveNotification', handleNewNotification);
      off('NotificationRead', handleRead);
      off('NotificationDeleted', handleDeleted);
    };
  }, [isConnected, onReceiveNotification, onNotificationRead, onNotificationDeleted, off]);

  return null;
}

/**
 * Example 6: Use in notification dropdown/page
 */
export function NotificationPage() {
  const { isConnected } = useNotificationHubContext();

  if (!isConnected) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          Đang kết nối đến server để nhận thông báo thời gian thực...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Your notification UI */}
      <NotificationListener />
      <ConnectionStatus />
    </div>
  );
}
