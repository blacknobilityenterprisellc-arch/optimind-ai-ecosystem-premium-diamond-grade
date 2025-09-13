/**
 * OptiMind AI Ecosystem - IoT Communication Protocols
 *
 * Implementation of IoT device communication protocols including MQTT, CoAP, 
 * WebSocket, and other common IoT protocols. This module provides the 
 * foundation for device connectivity and data exchange.
 *
 * Each protocol handler implements the ProtocolHandler interface from the
 * IoT Integration System and provides protocol-specific functionality.
 */

import { EventEmitter } from 'events';
import { 
  IoTDevice, 
  IoTProtocol, 
  DeviceStatus, 
  ConnectivityInfo, 
  ProtocolHandler 
} from './iot-integration-system';

// MQTT Protocol Implementation
export interface MQTTConfig {
  broker: string;
  port: number;
  username?: string;
  password?: string;
  clientId?: string;
  cleanSession: boolean;
  keepAlive: number;
  connectTimeout: number;
  reconnectPeriod: number;
  qos: 0 | 1 | 2;
  retain: boolean;
  will?: {
    topic: string;
    payload: string;
    qos: 0 | 1 | 2;
    retain: boolean;
  };
  ssl: boolean;
  rejectUnauthorized: boolean;
  ca?: string;
  cert?: string;
  key?: string;
}

export interface MQTTMessage {
  topic: string;
  payload: Buffer | string;
  qos: 0 | 1 | 2;
  retain: boolean;
  dup: boolean;
  messageId?: number;
}

export class MQTTProtocolHandler extends EventEmitter implements ProtocolHandler {
  protocol = IoTProtocol.MQTT;
  private clients: Map<string, any> = new Map(); // deviceId -> MQTT client
  private subscriptions: Map<string, string[]> = new Map(); // deviceId -> topics[]
  private config: MQTTConfig;

  constructor(config: Partial<MQTTConfig> = {}) {
    super();
    this.config = {
      broker: config.broker || 'localhost',
      port: config.port || 1883,
      username: config.username,
      password: config.password,
      clientId: config.clientId || `optimind-iot-${Date.now()}`,
      cleanSession: config.cleanSession ?? true,
      keepAlive: config.keepAlive || 60,
      connectTimeout: config.connectTimeout || 4000,
      reconnectPeriod: config.reconnectPeriod || 1000,
      qos: config.qos || 1,
      retain: config.retain ?? false,
      will: config.will,
      ssl: config.ssl ?? false,
      rejectUnauthorized: config.rejectUnauthorized ?? true,
      ca: config.ca,
      cert: config.cert,
      key: config.key,
    };
  }

  async connect(device: IoTDevice): Promise<boolean> {
    try {
      // Create MQTT client for device
      const client = this.createMQTTClient(device);
      
      return new Promise((resolve, reject) => {
        client.on('connect', () => {
          this.clients.set(device.id, client);
          this.setupDeviceSubscriptions(device, client);
          
          console.log(`🔌 MQTT connected: ${device.name}`);
          this.emit('connected', { deviceId: device.id, device });
          resolve(true);
        });

        client.on('error', (error: any) => {
          console.error(`❌ MQTT connection error for ${device.name}:`, error);
          this.emit('error', { deviceId: device.id, error });
          reject(error);
        });

        client.on('message', (topic: string, payload: Buffer) => {
          this.handleMQTTMessage(device.id, topic, payload);
        });

        client.on('close', () => {
          console.log(`🔌 MQTT disconnected: ${device.name}`);
          this.emit('disconnected', { deviceId: device.id, device });
        });

        client.on('offline', () => {
          console.log(`📴 MQTT offline: ${device.name}`);
          device.status = DeviceStatus.OFFLINE;
        });

        client.on('reconnect', () => {
          console.log(`🔄 MQTT reconnecting: ${device.name}`);
        });
      });
    } catch (error) {
      console.error(`❌ Failed to connect MQTT device ${device.name}:`, error);
      return false;
    }
  }

  async disconnect(deviceId: string): Promise<boolean> {
    const client = this.clients.get(deviceId);
    if (!client) {
      return false;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        client.end(false, {}, (error: any) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      this.clients.delete(deviceId);
      this.subscriptions.delete(deviceId);
      
      console.log(`🔌 MQTT disconnected: ${deviceId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to disconnect MQTT device ${deviceId}:`, error);
      return false;
    }
  }

  async sendData(deviceId: string, data: any): Promise<boolean> {
    const client = this.clients.get(deviceId);
    if (!client) {
      throw new Error('MQTT client not connected');
    }

    try {
      const topic = `optimind/iot/${deviceId}/data`;
      const payload = JSON.stringify(data);
      
      client.publish(topic, payload, { qos: this.config.qos, retain: this.config.retain });
      
      console.log(`📤 MQTT data sent: ${deviceId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send MQTT data to ${deviceId}:`, error);
      return false;
    }
  }

  async receiveData(deviceId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('MQTT receive data timeout'));
      }, 5000);

      const messageHandler = (data: any) => {
        clearTimeout(timeout);
        this.removeListener('data', messageHandler);
        resolve(data);
      };

      this.once('data', messageHandler);
    });
  }

  async getStatus(deviceId: string): Promise<ConnectivityInfo> {
    const client = this.clients.get(deviceId);
    if (!client) {
      return {
        protocol: this.protocol,
        endpoint: this.config.broker,
        port: this.config.port,
        connectionStatus: 'disconnected',
        lastPing: new Date(),
        latency: 0,
      };
    }

    return {
      protocol: this.protocol,
      endpoint: this.config.broker,
      port: this.config.port,
      connectionStatus: client.connected ? 'connected' : 'disconnected',
      signalStrength: this.calculateSignalStrength(deviceId),
      lastPing: new Date(),
      latency: this.calculateLatency(deviceId),
    };
  }

  private createMQTTClient(device: IoTDevice): any {
    // This is a mock implementation
    // In a real implementation, you would use a proper MQTT client library
    const mockClient = new EventEmitter();
    
    // Simulate MQTT client methods
    mockClient.connected = false;
    mockClient.end = function(force: boolean, opts: any, callback?: (error?: any) => void) {
      this.connected = false;
      this.emit('close');
      if (callback) callback();
      return this;
    };
    
    mockClient.publish = function(topic: string, payload: string, opts: any) {
      console.log(`📤 MQTT Publish: ${topic} -> ${payload}`);
      return this;
    };
    
    mockClient.subscribe = function(topic: string, opts: any, callback?: (error?: any, granted?: any[]) => void) {
      console.log(`📥 MQTT Subscribe: ${topic}`);
      if (callback) callback();
      return this;
    };
    
    mockClient.unsubscribe = function(topic: string, callback?: (error?: any) => void) {
      console.log(`📤 MQTT Unsubscribe: ${topic}`);
      if (callback) callback();
      return this;
    };

    // Simulate connection
    setTimeout(() => {
      mockClient.connected = true;
      mockClient.emit('connect');
    }, 100);

    return mockClient;
  }

  private setupDeviceSubscriptions(device: IoTDevice, client: any): void {
    const topics = [
      `optimind/iot/${device.id}/command`,
      `optimind/iot/${device.id}/config`,
      `optimind/iot/${device.id}/heartbeat`,
    ];

    const subscriptions = topics.map(topic => {
      client.subscribe(topic, { qos: this.config.qos });
      return topic;
    });

    this.subscriptions.set(device.id, subscriptions);
  }

  private handleMQTTMessage(deviceId: string, topic: string, payload: Buffer): void {
    try {
      const message: MQTTMessage = {
        topic,
        payload: payload.toString(),
        qos: 1,
        retain: false,
        dup: false,
      };

      const data = JSON.parse(message.payload);
      
      this.emit('data', { deviceId, topic, data, message });
      
      console.log(`📥 MQTT message received: ${deviceId} - ${topic}`);
    } catch (error) {
      console.error(`❌ Failed to parse MQTT message from ${deviceId}:`, error);
    }
  }

  private calculateSignalStrength(deviceId: string): number {
    // Mock signal strength calculation
    return Math.floor(Math.random() * 100) + 1;
  }

  private calculateLatency(deviceId: string): number {
    // Mock latency calculation
    return Math.floor(Math.random() * 100) + 10;
  }
}

// CoAP Protocol Implementation
export interface CoAPConfig {
  host: string;
  port: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  observe?: boolean;
  confirmable: boolean;
  token?: string;
  options?: CoAPOption[];
  payload?: Buffer;
}

export interface CoAPOption {
  name: number;
  value: Buffer;
}

export interface CoAPResponse {
  code: string;
  payload: Buffer;
  options: CoAPOption[];
}

export class CoAPProtocolHandler extends EventEmitter implements ProtocolHandler {
  protocol = IoTProtocol.COAP;
  private connections: Map<string, any> = new Map(); // deviceId -> CoAP connection
  private config: CoAPConfig;

  constructor(config: Partial<CoAPConfig> = {}) {
    super();
    this.config = {
      host: config.host || 'localhost',
      port: config.port || 5683,
      method: config.method || 'GET',
      observe: config.observe,
      confirmable: config.confirmable ?? true,
      token: config.token,
      options: config.options || [],
      payload: config.payload,
    };
  }

  async connect(device: IoTDevice): Promise<boolean> {
    try {
      const connection = this.createCoAPConnection(device);
      
      return new Promise((resolve, reject) => {
        connection.on('connect', () => {
          this.connections.set(device.id, connection);
          
          console.log(`🔌 CoAP connected: ${device.name}`);
          this.emit('connected', { deviceId: device.id, device });
          resolve(true);
        });

        connection.on('error', (error: any) => {
          console.error(`❌ CoAP connection error for ${device.name}:`, error);
          this.emit('error', { deviceId: device.id, error });
          reject(error);
        });

        connection.on('response', (response: CoAPResponse) => {
          this.handleCoAPResponse(device.id, response);
        });
      });
    } catch (error) {
      console.error(`❌ Failed to connect CoAP device ${device.name}:`, error);
      return false;
    }
  }

  async disconnect(deviceId: string): Promise<boolean> {
    const connection = this.connections.get(deviceId);
    if (!connection) {
      return false;
    }

    try {
      connection.close();
      this.connections.delete(deviceId);
      
      console.log(`🔌 CoAP disconnected: ${deviceId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to disconnect CoAP device ${deviceId}:`, error);
      return false;
    }
  }

  async sendData(deviceId: string, data: any): Promise<boolean> {
    const connection = this.connections.get(deviceId);
    if (!connection) {
      throw new Error('CoAP connection not established');
    }

    try {
      const payload = Buffer.from(JSON.stringify(data));
      const response = await this.sendCoAPRequest(connection, {
        ...this.config,
        method: 'POST',
        payload,
      });

      console.log(`📤 CoAP data sent: ${deviceId}`);
      return response.code.startsWith('2'); // 2.xx codes are success
    } catch (error) {
      console.error(`❌ Failed to send CoAP data to ${deviceId}:`, error);
      return false;
    }
  }

  async receiveData(deviceId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('CoAP receive data timeout'));
      }, 5000);

      const responseHandler = (data: any) => {
        clearTimeout(timeout);
        this.removeListener('data', responseHandler);
        resolve(data);
      };

      this.once('data', responseHandler);
    });
  }

  async getStatus(deviceId: string): Promise<ConnectivityInfo> {
    const connection = this.connections.get(deviceId);
    if (!connection) {
      return {
        protocol: this.protocol,
        endpoint: this.config.host,
        port: this.config.port,
        connectionStatus: 'disconnected',
        lastPing: new Date(),
        latency: 0,
      };
    }

    return {
      protocol: this.protocol,
      endpoint: this.config.host,
      port: this.config.port,
      connectionStatus: 'connected',
      signalStrength: this.calculateSignalStrength(deviceId),
      lastPing: new Date(),
      latency: this.calculateLatency(deviceId),
    };
  }

  private createCoAPConnection(device: IoTDevice): any {
    // Mock CoAP connection
    const mockConnection = new EventEmitter();
    
    mockConnection.close = function() {
      this.emit('close');
      return this;
    };

    // Simulate connection
    setTimeout(() => {
      mockConnection.emit('connect');
    }, 100);

    return mockConnection;
  }

  private async sendCoAPRequest(connection: any, config: CoAPConfig): Promise<CoAPResponse> {
    return new Promise((resolve) => {
      // Mock CoAP request/response
      setTimeout(() => {
        resolve({
          code: '2.05', // Content
          payload: Buffer.from(JSON.stringify({ success: true })),
          options: [],
        });
      }, 50);
    });
  }

  private handleCoAPResponse(deviceId: string, response: CoAPResponse): void {
    try {
      const data = JSON.parse(response.payload.toString());
      
      this.emit('data', { deviceId, response, data });
      
      console.log(`📥 CoAP response received: ${deviceId}`);
    } catch (error) {
      console.error(`❌ Failed to parse CoAP response from ${deviceId}:`, error);
    }
  }

  private calculateSignalStrength(deviceId: string): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  private calculateLatency(deviceId: string): number {
    return Math.floor(Math.random() * 200) + 20;
  }
}

// WebSocket Protocol Implementation
export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  headers?: Record<string, string>;
  handshakeTimeout?: number;
  perMessageDeflate?: boolean;
  maxPayload?: number;
}

export class WebSocketProtocolHandler extends EventEmitter implements ProtocolHandler {
  protocol = IoTProtocol.WEBSOCKET;
  private connections: Map<string, any> = new Map(); // deviceId -> WebSocket connection
  private config: WebSocketConfig;

  constructor(config: Partial<WebSocketConfig> = {}) {
    super();
    this.config = {
      url: config.url || 'ws://localhost:8080',
      protocols: config.protocols,
      headers: config.headers,
      handshakeTimeout: config.handshakeTimeout || 5000,
      perMessageDeflate: config.perMessageDeflate ?? true,
      maxPayload: config.maxPayload || 1024 * 1024, // 1MB
    };
  }

  async connect(device: IoTDevice): Promise<boolean> {
    try {
      const connection = this.createWebSocketConnection(device);
      
      return new Promise((resolve, reject) => {
        connection.on('open', () => {
          this.connections.set(device.id, connection);
          
          console.log(`🔌 WebSocket connected: ${device.name}`);
          this.emit('connected', { deviceId: device.id, device });
          resolve(true);
        });

        connection.on('error', (error: any) => {
          console.error(`❌ WebSocket connection error for ${device.name}:`, error);
          this.emit('error', { deviceId: device.id, error });
          reject(error);
        });

        connection.on('message', (data: any) => {
          this.handleWebSocketMessage(device.id, data);
        });

        connection.on('close', (code: number, reason: string) => {
          console.log(`🔌 WebSocket closed: ${device.name} (${code}: ${reason})`);
          this.emit('disconnected', { deviceId: device.id, code, reason });
        });

        connection.on('ping', (data: Buffer) => {
          connection.pong(data);
        });

        connection.on('pong', (data: Buffer) => {
          // Handle pong response
        });
      });
    } catch (error) {
      console.error(`❌ Failed to connect WebSocket device ${device.name}:`, error);
      return false;
    }
  }

  async disconnect(deviceId: string): Promise<boolean> {
    const connection = this.connections.get(deviceId);
    if (!connection) {
      return false;
    }

    try {
      connection.close(1000, 'Normal closure');
      this.connections.delete(deviceId);
      
      console.log(`🔌 WebSocket disconnected: ${deviceId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to disconnect WebSocket device ${deviceId}:`, error);
      return false;
    }
  }

  async sendData(deviceId: string, data: any): Promise<boolean> {
    const connection = this.connections.get(deviceId);
    if (!connection || connection.readyState !== 1) { // 1 = OPEN
      throw new Error('WebSocket connection not open');
    }

    try {
      const message = JSON.stringify(data);
      connection.send(message);
      
      console.log(`📤 WebSocket data sent: ${deviceId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send WebSocket data to ${deviceId}:`, error);
      return false;
    }
  }

  async receiveData(deviceId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('WebSocket receive data timeout'));
      }, 5000);

      const messageHandler = (data: any) => {
        clearTimeout(timeout);
        this.removeListener('data', messageHandler);
        resolve(data);
      };

      this.once('data', messageHandler);
    });
  }

  async getStatus(deviceId: string): Promise<ConnectivityInfo> {
    const connection = this.connections.get(deviceId);
    if (!connection) {
      return {
        protocol: this.protocol,
        endpoint: this.config.url,
        port: 0,
        connectionStatus: 'disconnected',
        lastPing: new Date(),
        latency: 0,
      };
    }

    const status = connection.readyState === 1 ? 'connected' : 'disconnected';
    
    return {
      protocol: this.protocol,
      endpoint: this.config.url,
      port: 0,
      connectionStatus: status,
      signalStrength: this.calculateSignalStrength(deviceId),
      lastPing: new Date(),
      latency: this.calculateLatency(deviceId),
    };
  }

  private createWebSocketConnection(device: IoTDevice): any {
    // Mock WebSocket connection
    const mockConnection = new EventEmitter();
    mockConnection.readyState = 0; // CONNECTING
    
    mockConnection.close = function(code: number, reason: string) {
      this.readyState = 3; // CLOSED
      this.emit('close', code, reason);
      return this;
    };
    
    mockConnection.send = function(data: string) {
      console.log(`📤 WebSocket Send: ${data}`);
      if (this.readyState === 1) {
        // Echo back for testing
        setTimeout(() => {
          this.emit('message', data);
        }, 10);
      }
      return true;
    };
    
    mockConnection.ping = function(data: Buffer) {
      setTimeout(() => {
        this.emit('pong', data);
      }, 5);
    };

    // Simulate connection opening
    setTimeout(() => {
      mockConnection.readyState = 1; // OPEN
      mockConnection.emit('open');
    }, 100);

    return mockConnection;
  }

  private handleWebSocketMessage(deviceId: string, data: any): void {
    try {
      let parsedData;
      
      if (Buffer.isBuffer(data)) {
        parsedData = JSON.parse(data.toString());
      } else if (typeof data === 'string') {
        parsedData = JSON.parse(data);
      } else {
        parsedData = data;
      }
      
      this.emit('data', { deviceId, data: parsedData });
      
      console.log(`📥 WebSocket message received: ${deviceId}`);
    } catch (error) {
      console.error(`❌ Failed to parse WebSocket message from ${deviceId}:`, error);
    }
  }

  private calculateSignalStrength(deviceId: string): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  private calculateLatency(deviceId: string): number {
    return Math.floor(Math.random() * 50) + 5; // WebSocket typically has low latency
  }
}

// HTTP Protocol Implementation
export interface HTTPConfig {
  baseUrl: string;
  timeout: number;
  headers?: Record<string, string>;
  authentication?: {
    type: 'bearer' | 'basic' | 'apikey';
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
  };
  retryAttempts: number;
  retryDelay: number;
}

export class HTTPProtocolHandler extends EventEmitter implements ProtocolHandler {
  protocol = IoTProtocol.HTTP;
  private clients: Map<string, any> = new Map(); // deviceId -> HTTP client info
  private config: HTTPConfig;

  constructor(config: Partial<HTTPConfig> = {}) {
    super();
    this.config = {
      baseUrl: config.baseUrl || 'http://localhost',
      timeout: config.timeout || 5000,
      headers: config.headers || { 'Content-Type': 'application/json' },
      authentication: config.authentication,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
    };
  }

  async connect(device: IoTDevice): Promise<boolean> {
    try {
      // For HTTP, "connection" means testing if the device endpoint is reachable
      const clientInfo = {
        deviceId: device.id,
        endpoint: `${this.config.baseUrl}/devices/${device.id}`,
        lastPing: new Date(),
        connected: true,
      };

      const reachable = await this.testEndpoint(clientInfo.endpoint);
      if (reachable) {
        this.clients.set(device.id, clientInfo);
        
        console.log(`🔌 HTTP connected: ${device.name}`);
        this.emit('connected', { deviceId: device.id, device });
        return true;
      } else {
        throw new Error('HTTP endpoint not reachable');
      }
    } catch (error) {
      console.error(`❌ Failed to connect HTTP device ${device.name}:`, error);
      return false;
    }
  }

  async disconnect(deviceId: string): Promise<boolean> {
    const clientInfo = this.clients.get(deviceId);
    if (!clientInfo) {
      return false;
    }

    try {
      clientInfo.connected = false;
      this.clients.delete(deviceId);
      
      console.log(`🔌 HTTP disconnected: ${deviceId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to disconnect HTTP device ${deviceId}:`, error);
      return false;
    }
  }

  async sendData(deviceId: string, data: any): Promise<boolean> {
    const clientInfo = this.clients.get(deviceId);
    if (!clientInfo?.connected) {
      throw new Error('HTTP client not connected');
    }

    try {
      const response = await this.sendHTTPRequest(`${clientInfo.endpoint  }/data`, 'POST', data);
      
      console.log(`📤 HTTP data sent: ${deviceId}`);
      return response.ok;
    } catch (error) {
      console.error(`❌ Failed to send HTTP data to ${deviceId}:`, error);
      return false;
    }
  }

  async receiveData(deviceId: string): Promise<any> {
    const clientInfo = this.clients.get(deviceId);
    if (!clientInfo?.connected) {
      throw new Error('HTTP client not connected');
    }

    try {
      const response = await this.sendHTTPRequest(`${clientInfo.endpoint  }/data`, 'GET');
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to receive HTTP data from ${deviceId}:`, error);
      throw error;
    }
  }

  async getStatus(deviceId: string): Promise<ConnectivityInfo> {
    const clientInfo = this.clients.get(deviceId);
    if (!clientInfo) {
      return {
        protocol: this.protocol,
        endpoint: this.config.baseUrl,
        port: 80,
        connectionStatus: 'disconnected',
        lastPing: new Date(),
        latency: 0,
      };
    }

    return {
      protocol: this.protocol,
      endpoint: this.config.baseUrl,
      port: 80,
      connectionStatus: clientInfo.connected ? 'connected' : 'disconnected',
      signalStrength: this.calculateSignalStrength(deviceId),
      lastPing: clientInfo.lastPing,
      latency: this.calculateLatency(deviceId),
    };
  }

  private async testEndpoint(endpoint: string): Promise<boolean> {
    try {
      const response = await this.sendHTTPRequest(endpoint, 'GET');
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private async sendHTTPRequest(url: string, method: string, data?: any): Promise<any> {
    // Mock HTTP request implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve({
            ok: true,
            status: 200,
            data: data ? { ...data, processed: true } : { status: 'ok' },
          });
        } else {
          reject(new Error('HTTP request failed'));
        }
      }, Math.random() * 200 + 50); // 50-250ms latency
    });
  }

  private calculateSignalStrength(deviceId: string): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  private calculateLatency(deviceId: string): number {
    return Math.floor(Math.random() * 300) + 50;
  }
}

// Protocol Factory
export class ProtocolFactory {
  static createHandler(protocol: IoTProtocol, config?: any): ProtocolHandler {
    switch (protocol) {
      case IoTProtocol.MQTT:
        return new MQTTProtocolHandler(config);
      case IoTProtocol.COAP:
        return new CoAPProtocolHandler(config);
      case IoTProtocol.WEBSOCKET:
        return new WebSocketProtocolHandler(config);
      case IoTProtocol.HTTP:
        return new HTTPProtocolHandler(config);
      default:
        throw new Error(`Unsupported protocol: ${protocol}`);
    }
  }
}

// Export protocol handlers and configurations
export {
  MQTTProtocolHandler,
  CoAPProtocolHandler,
  WebSocketProtocolHandler,
  HTTPProtocolHandler,
  ProtocolFactory,
};