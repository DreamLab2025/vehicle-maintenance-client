import * as signalR from '@microsoft/signalr';
import Cookies from 'js-cookie';

/**
 * SignalR Hub Configuration
 * Manages real-time notification connection to backend
 */

// Hub URL from environment variable
const HUB_URL = `${process.env.NEXT_PUBLIC_API_URL_API_GATEWAY}/hubs/notifications`;

/**
 * Create and configure SignalR connection
 * @returns HubConnection instance with JWT authentication
 */
export const createNotificationHubConnection = (): signalR.HubConnection => {
  // Get JWT token from cookies
  const token = Cookies.get('auth-token');

  if (!token) {
    console.warn('No auth token found. SignalR connection may fail.');
  }

  // Create connection with configuration
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => token || '',
      skipNegotiation: false,
      transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        // Exponential backoff: 0s, 2s, 10s, 30s, then 30s
        if (retryContext.previousRetryCount === 0) return 0;
        if (retryContext.previousRetryCount === 1) return 2000;
        if (retryContext.previousRetryCount === 2) return 10000;
        return 30000;
      },
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  // Connection event handlers
  connection.onclose((error) => {
    if (error) {
      console.error('SignalR connection closed with error:', error);
    } else {
      console.log('SignalR connection closed');
    }
  });

  connection.onreconnecting((error) => {
    console.warn('SignalR reconnecting...', error);
  });

  connection.onreconnected((connectionId) => {
    console.log('SignalR reconnected. Connection ID:', connectionId);
  });

  return connection;
};

/**
 * Start SignalR connection with error handling
 * @param connection HubConnection instance
 * @returns Promise<void>
 */
export const startHubConnection = async (
  connection: signalR.HubConnection
): Promise<void> => {
  try {
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      await connection.start();
      console.log('✅ SignalR connected to notifications hub');
    }
  } catch (error) {
    console.error('❌ Failed to start SignalR connection:', error);
    throw error;
  }
};

/**
 * Stop SignalR connection gracefully
 * @param connection HubConnection instance
 * @returns Promise<void>
 */
export const stopHubConnection = async (
  connection: signalR.HubConnection
): Promise<void> => {
  try {
    if (connection.state !== signalR.HubConnectionState.Disconnected) {
      await connection.stop();
      console.log('SignalR connection stopped');
    }
  } catch (error) {
    console.error('Failed to stop SignalR connection:', error);
  }
};

/**
 * SignalR Hub Events (to be implemented by backend)
 * These are the event names that the hub will send/receive
 */
export const HubEvents = {
  // Receive events from server
  RECEIVE_NOTIFICATION: 'ReceiveNotification',
  NOTIFICATION_READ: 'NotificationRead',
  NOTIFICATION_DELETED: 'NotificationDeleted',

  // Send events to server
  MARK_AS_READ: 'MarkAsRead',
  DELETE_NOTIFICATION: 'DeleteNotification',
  JOIN_USER_GROUP: 'JoinUserGroup',
} as const;

export type HubEventType = typeof HubEvents[keyof typeof HubEvents];
