import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import {
  createNotificationHubConnection,
  startHubConnection,
  stopHubConnection,
  HubEvents,
} from '@/lib/config/signalr.config';
import { useAuth } from './useAuth';

/**
 * Custom hook for SignalR notification hub
 * Automatically connects when user is authenticated
 */
export const useNotificationHub = () => {
  const { user } = useAuth();
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<signalR.HubConnectionState>(
    signalR.HubConnectionState.Disconnected
  );

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user) {
      // Cleanup connection if user logs out
      if (connectionRef.current) {
        stopHubConnection(connectionRef.current);
        connectionRef.current = null;
        setIsConnected(false);
        setConnectionState(signalR.HubConnectionState.Disconnected);
      }
      return;
    }

    // Create connection
    const connection = createNotificationHubConnection();
    connectionRef.current = connection;

    // Update connection state
    const updateConnectionState = () => {
      setConnectionState(connection.state);
      setIsConnected(connection.state === signalR.HubConnectionState.Connected);
    };

    // Setup event listeners
    connection.onclose(() => {
      updateConnectionState();
    });

    connection.onreconnecting(() => {
      updateConnectionState();
    });

    connection.onreconnected(() => {
      updateConnectionState();
    });

    // Start connection
    startHubConnection(connection)
      .then(() => {
        updateConnectionState();
        console.log('🔔 Notification hub connected for user:', user.email);
      })
      .catch((error) => {
        console.error('Failed to connect to notification hub:', error);
        updateConnectionState();
      });

    // Cleanup on unmount
    return () => {
      if (connectionRef.current) {
        stopHubConnection(connectionRef.current);
      }
    };
  }, [user]);

  /**
   * Register a handler for receiving notifications
   * @param callback Function to handle incoming notifications
   */
  const onReceiveNotification = (callback: (notification: any) => void) => {
    if (connectionRef.current) {
      connectionRef.current.on(HubEvents.RECEIVE_NOTIFICATION, callback);
    }
  };

  /**
   * Register a handler for notification read event
   * @param callback Function to handle notification read
   */
  const onNotificationRead = (callback: (notificationId: string) => void) => {
    if (connectionRef.current) {
      connectionRef.current.on(HubEvents.NOTIFICATION_READ, callback);
    }
  };

  /**
   * Register a handler for notification deleted event
   * @param callback Function to handle notification deleted
   */
  const onNotificationDeleted = (callback: (notificationId: string) => void) => {
    if (connectionRef.current) {
      connectionRef.current.on(HubEvents.NOTIFICATION_DELETED, callback);
    }
  };

  /**
   * Send mark as read event to server
   * @param notificationId ID of the notification to mark as read
   */
  const markAsRead = async (notificationId: string) => {
    if (connectionRef.current && isConnected) {
      try {
        await connectionRef.current.invoke(HubEvents.MARK_AS_READ, notificationId);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
        throw error;
      }
    }
  };

  /**
   * Send delete notification event to server
   * @param notificationId ID of the notification to delete
   */
  const deleteNotification = async (notificationId: string) => {
    if (connectionRef.current && isConnected) {
      try {
        await connectionRef.current.invoke(HubEvents.DELETE_NOTIFICATION, notificationId);
      } catch (error) {
        console.error('Failed to delete notification:', error);
        throw error;
      }
    }
  };

  /**
   * Unregister event handler
   * @param eventName Name of the event to unregister
   * @param callback Callback function to remove
   */
  const off = (eventName: string, callback?: (...args: any[]) => void) => {
    if (connectionRef.current) {
      connectionRef.current.off(eventName, callback);
    }
  };

  return {
    connection: connectionRef.current,
    isConnected,
    connectionState,
    onReceiveNotification,
    onNotificationRead,
    onNotificationDeleted,
    markAsRead,
    deleteNotification,
    off,
  };
};
