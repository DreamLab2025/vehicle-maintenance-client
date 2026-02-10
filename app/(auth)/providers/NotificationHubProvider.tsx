"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useNotificationHub } from '@/hooks/useNotificationHub';
import * as signalR from '@microsoft/signalr';

/**
 * Context type for NotificationHub
 */
type NotificationHubContextType = {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  connectionState: signalR.HubConnectionState;
  onReceiveNotification: (callback: (notification: any) => void) => void;
  onNotificationRead: (callback: (notificationId: string) => void) => void;
  onNotificationDeleted: (callback: (notificationId: string) => void) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  off: (eventName: string, callback?: (...args: any[]) => void) => void;
};

const NotificationHubContext = createContext<NotificationHubContextType | null>(null);

/**
 * NotificationHubProvider
 * Manages SignalR connection for real-time notifications
 * Automatically connects when user is authenticated
 */
export function NotificationHubProvider({ children }: { children: ReactNode }) {
  const hub = useNotificationHub();

  return (
    <NotificationHubContext.Provider value={hub}>
      {children}
    </NotificationHubContext.Provider>
  );
}

/**
 * Hook to access NotificationHub context
 * Must be used inside NotificationHubProvider
 */
export const useNotificationHubContext = () => {
  const ctx = useContext(NotificationHubContext);
  if (!ctx) {
    throw new Error('useNotificationHubContext must be used inside NotificationHubProvider');
  }
  return ctx;
};
