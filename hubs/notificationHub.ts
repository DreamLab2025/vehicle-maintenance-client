"use client";

import {
  HubConnection,
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
  RetryContext,
} from "@microsoft/signalr";

/* ===================== TYPES ===================== */

export interface NotificationHubConnection {
  connection: HubConnection | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

/* ===================== HUB CONNECTION ===================== */

class NotificationHubService {
  private hubConnection: HubConnection | null = null;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private error: string | null = null;

  /* ---------- Get Base URL ---------- */
  private getBaseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL_API_GATEWAY || "";
    if (!baseUrl) {
      console.error("❌ NEXT_PUBLIC_API_URL_API_GATEWAY is not defined");
      return "";
    }
    return baseUrl;
  }

  /* ---------- Create Connection ---------- */
  private createConnection(accessToken: string): HubConnection {
    const baseUrl = this.getBaseUrl();
    const hubUrl = `${baseUrl}/hubs/notifications`;

    console.log("🔗 Creating SignalR connection to:", hubUrl);

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => {
          console.log("🔑 Using access token for SignalR connection");
          return accessToken;
        },
        skipNegotiation: false,
        transport: HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents | HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext: RetryContext) => {
          if (retryContext.previousRetryCount < 3) {
            return 2000; // 2 seconds
          }
          return 5000; // 5 seconds
        },
      })
      .configureLogging(LogLevel.Information)
      .build();

    // Connection event handlers
    connection.onclose((error?: Error) => {
      console.log("🔌 SignalR connection closed", error ? `with error: ${error}` : "");
      this.isConnected = false;
      this.error = error ? error.message : null;
    });

    connection.onreconnecting((error?: Error) => {
      console.log("🔄 SignalR reconnecting...", error ? `Error: ${error}` : "");
      this.isConnecting = true;
      this.isConnected = false;
    });

    connection.onreconnected((connectionId?: string) => {
      console.log("✅ SignalR reconnected! Connection ID:", connectionId);
      this.isConnected = true;
      this.isConnecting = false;
      this.error = null;
      // Re-subscribe to Notification method on reconnect
      // Note: The callback should be stored if needed for reconnection
    });

    return connection;
  }

  /* ---------- Start Connection ---------- */
  async startConnection(accessToken: string, onNotification?: (...args: unknown[]) => void): Promise<boolean> {
    if (this.isConnecting) {
      console.log("⏳ Connection already in progress...");
      return false;
    }

    if (this.isConnected && this.hubConnection) {
      console.log("✅ Hub already connected");
      // Subscribe to Notification method if callback provided and not already subscribed
      if (onNotification) {
        this.on("Notification", onNotification);
      }
      return true;
    }

    try {
      this.isConnecting = true;
      this.error = null;

      console.log("🚀 Starting SignalR connection...");

      this.hubConnection = this.createConnection(accessToken);

      await this.hubConnection.start();

      this.isConnected = true;
      this.isConnecting = false;
      this.error = null;

      console.log("✅ SignalR hub connected successfully!");
      console.log("📡 Connection State:", this.hubConnection.state);
      console.log("🔗 Connection ID:", this.hubConnection.connectionId);

      // Subscribe to Notification method after connection is established
      if (onNotification) {
        this.on("Notification", onNotification);
        console.log("📥 Subscribed to 'Notification' method");
      }

      return true;
    } catch (error) {
      this.isConnected = false;
      this.isConnecting = false;
      this.error = error instanceof Error ? error.message : "Unknown error";

      console.error("❌ Failed to start SignalR connection:", error);
      console.error("❌ Error details:", this.error);

      return false;
    }
  }

  /* ---------- Stop Connection ---------- */
  async stopConnection(): Promise<void> {
    if (!this.hubConnection) {
      console.log("ℹ️ No connection to stop");
      return;
    }

    try {
      console.log("🛑 Stopping SignalR connection...");
      await this.hubConnection.stop();
      this.hubConnection = null;
      this.isConnected = false;
      this.isConnecting = false;
      this.error = null;
      console.log("✅ SignalR connection stopped");
    } catch (error) {
      console.error("❌ Error stopping SignalR connection:", error);
      this.hubConnection = null;
      this.isConnected = false;
      this.isConnecting = false;
    }
  }

  /* ---------- Get Connection State ---------- */
  getConnectionState(): NotificationHubConnection {
    return {
      connection: this.hubConnection,
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      error: this.error,
    };
  }

  /* ---------- Subscribe to Hub Methods ---------- */
  on(methodName: string, callback: (...args: unknown[]) => void): void {
    if (!this.hubConnection) {
      console.warn("⚠️ Cannot subscribe: Hub connection not established");
      return;
    }

    this.hubConnection.on(methodName, callback);
    console.log(`📥 Subscribed to hub method: ${methodName}`);
  }

  /* ---------- Invoke Hub Methods ---------- */
  async invoke<T = unknown>(methodName: string, ...args: unknown[]): Promise<T> {
    if (!this.hubConnection) {
      throw new Error("Hub connection not established");
    }

    if (!this.isConnected) {
      throw new Error("Hub connection is not connected");
    }

    try {
      console.log(`📤 Invoking hub method: ${methodName}`, args);
      const result = await this.hubConnection.invoke(methodName, ...args);
      console.log(`✅ Hub method ${methodName} result:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Error invoking hub method ${methodName}:`, error);
      throw error;
    }
  }

  /* ---------- Off/Unsubscribe ---------- */
  off(methodName: string, callback?: (...args: unknown[]) => void): void {
    if (!this.hubConnection) {
      return;
    }

    if (callback) {
      this.hubConnection.off(methodName, callback);
    } else {
      this.hubConnection.off(methodName);
    }
    console.log(`📴 Unsubscribed from hub method: ${methodName}`);
  }
}

/* ===================== SINGLETON INSTANCE ===================== */

const notificationHubService = new NotificationHubService();

export default notificationHubService;
