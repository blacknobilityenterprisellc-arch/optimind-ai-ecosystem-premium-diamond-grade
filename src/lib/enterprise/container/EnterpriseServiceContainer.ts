/**
 * Premium Diamond-Grade Professional Enterprise Service Container
 *
 * This module implements a comprehensive service container with dependency injection,
 * lifecycle management, and enterprise-grade features for robust service management.
 *
 * Features:
 * - Dependency injection with automatic resolution
 * - Service lifecycle management (singleton, transient, scoped)
 * - Circular dependency detection and prevention
 * - Service health monitoring and metrics
 * - Graceful shutdown and error recovery
 * - Service discovery and registration
 * - Event-driven architecture for service communication
 * - Performance monitoring and optimization
 * - Thread-safe service access
 * - Configuration-driven service initialization
 *
 * @author: Enterprise Architecture Team
 * @version: 2.0.0
 * @compliance: Enterprise Service Standards
 */

import { EventEmitter } from "events";
import { EnterpriseEnvironmentConfig } from "../environment/EnterpriseEnvironmentConfig";

// Service lifecycle states
export enum ServiceLifecycle {
  REGISTERED = "REGISTERED",
  INITIALIZING = "INITIALIZING",
  INITIALIZED = "INITIALIZED",
  STARTING = "STARTING",
  RUNNING = "RUNNING",
  STOPPING = "STOPPING",
  STOPPED = "STOPPED",
  DISPOSING = "DISPOSING",
  DISPOSED = "DISPOSED",
  ERROR = "ERROR",
}

// Service scope types
export enum ServiceScope {
  SINGLETON = "SINGLETON", // Single instance for entire application
  TRANSIENT = "TRANSIENT", // New instance for each request
  SCOPED = "SCOPED", // Single instance per scope
}

// Service metadata
export interface ServiceMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies: string[];
  tags: string[];
  scope: ServiceScope;
  priority: number;
  timeout: number;
  retryCount: number;
  healthCheckEnabled: boolean;
  metricsEnabled: boolean;
}

// Service health status
export interface ServiceHealth {
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY" | "UNKNOWN";
  timestamp: number;
  uptime: number;
  memoryUsage: number;
  cpuUsage?: number;
  lastError?: Error;
  metrics: Record<string, number>;
  checks: {
    name: string;
    status: "PASS" | "FAIL" | "WARN";
    message?: string;
    timestamp: number;
  }[];
}

// Service interface
export interface IService {
  readonly name: string;
  readonly metadata: ServiceMetadata;
  initialize?(): Promise<void>;
  start?(): Promise<void>;
  stop?(): Promise<void>;
  dispose?(): Promise<void>;
  healthCheck?(): Promise<ServiceHealth>;
  getMetrics?(): Promise<Record<string, number>>;
}

// Service factory function
export type ServiceFactory<T extends IService = IService> = (
  container: EnterpriseServiceContainer,
) => Promise<T> | T;

// Service descriptor
export interface ServiceDescriptor<T extends IService = IService> {
  name: string;
  factory: ServiceFactory<T>;
  metadata: Partial<ServiceMetadata>;
  dependencies?: string[];
  config?: Record<string, any>;
}

// Service instance wrapper
interface ServiceInstance<T extends IService = IService> {
  service: T;
  metadata: ServiceMetadata;
  lifecycle: ServiceLifecycle;
  createdAt: number;
  startedAt?: number;
  stoppedAt?: number;
  lastHealthCheck?: number;
  health?: ServiceHealth;
  metrics: Record<string, number>;
  errorCount: number;
  lastError?: Error;
}

// Scope context
export interface ScopeContext {
  id: string;
  parentId?: string;
  createdAt: number;
  services: Map<string, IService>;
  metadata: Record<string, any>;
}

// Container configuration
export interface ContainerConfig {
  enableCircularDependencyCheck: boolean;
  enableHealthMonitoring: boolean;
  enableMetrics: boolean;
  enableGracefulShutdown: boolean;
  shutdownTimeout: number;
  healthCheckInterval: number;
  metricsInterval: number;
  maxServiceInstances: number;
  enableServiceDiscovery: boolean;
  enableEventBus: boolean;
}

// Enterprise service container
export class EnterpriseServiceContainer extends EventEmitter {
  private services: Map<string, ServiceDescriptor> = new Map();
  private instances: Map<string, ServiceInstance> = new Map();
  private scopes: Map<string, ScopeContext> = new Map();
  private config: ContainerConfig;
  private environment: EnterpriseEnvironmentConfig;
  private healthCheckTimer?: NodeJS.Timeout;
  private metricsTimer?: NodeJS.Timeout;
  private isInitialized = false;
  private isShuttingDown = false;
  private initializationPromises: Map<string, Promise<any>> = new Map();
  private dependencyGraph: Map<string, Set<string>> = new Map();
  private eventBus: EventEmitter;

  constructor(
    environment: EnterpriseEnvironmentConfig,
    config: Partial<ContainerConfig> = {},
  ) {
    super();
    this.environment = environment;
    this.config = {
      enableCircularDependencyCheck: true,
      enableHealthMonitoring: true,
      enableMetrics: true,
      enableGracefulShutdown: true,
      shutdownTimeout: 30000,
      healthCheckInterval: 60000,
      metricsInterval: 30000,
      maxServiceInstances: 1000,
      enableServiceDiscovery: true,
      enableEventBus: true,
      ...config,
    };
    this.eventBus = new EventEmitter();
    this.setupEventHandlers();
    this.setupGracefulShutdown();
  }

  private setupEventHandlers(): void {
    this.eventBus.on("service:registered", (descriptor: ServiceDescriptor) => {
      this.emit("service:registered", descriptor);
    });

    this.eventBus.on("service:initialized", (instance: ServiceInstance) => {
      this.emit("service:initialized", instance);
    });

    this.eventBus.on("service:started", (instance: ServiceInstance) => {
      this.emit("service:started", instance);
    });

    this.eventBus.on("service:stopped", (instance: ServiceInstance) => {
      this.emit("service:stopped", instance);
    });

    this.eventBus.on(
      "service:error",
      (instance: ServiceInstance, error: Error) => {
        this.emit("service:error", instance, error);
      },
    );

    this.eventBus.on("service:health:changed", (instance: ServiceInstance) => {
      this.emit("service:health:changed", instance);
    });
  }

  private setupGracefulShutdown(): void {
    if (!this.config.enableGracefulShutdown) return;

    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}, initiating graceful shutdown...`);
      await this.shutdown();
      process.exit(0);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGUSR2", () => shutdown("SIGUSR2")); // For nodemon
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.emit("initializing");

      // Initialize all registered services
      const initializationPromises = Array.from(this.services.values()).map(
        async (descriptor) => {
          try {
            await this.initializeService(descriptor.name);
          } catch (error) {
            console.error(
              `Failed to initialize service ${descriptor.name}:`,
              error,
            );
            this.eventBus.emit(
              "service:error",
              this.instances.get(descriptor.name),
              error as Error,
            );
          }
        },
      );

      await Promise.all(initializationPromises);

      // Start health monitoring
      if (this.config.enableHealthMonitoring) {
        this.startHealthMonitoring();
      }

      // Start metrics collection
      if (this.config.enableMetrics) {
        this.startMetricsCollection();
      }

      this.isInitialized = true;
      this.emit("initialized");
    } catch (error) {
      this.emit("error", error);
      throw error;
    }
  }

  register<T extends IService>(descriptor: ServiceDescriptor<T>): void {
    if (this.services.has(descriptor.name)) {
      throw new Error(`Service ${descriptor.name} is already registered`);
    }

    // Complete metadata with defaults
    const metadata: ServiceMetadata = {
      name: descriptor.name,
      version: "1.0.0",
      description: "",
      author: "",
      dependencies: descriptor.dependencies || [],
      tags: [],
      scope: ServiceScope.SINGLETON,
      priority: 0,
      timeout: 30000,
      retryCount: 3,
      healthCheckEnabled: true,
      metricsEnabled: true,
      ...descriptor.metadata,
    };

    const completeDescriptor: ServiceDescriptor<T> = {
      ...descriptor,
      metadata,
    };

    this.services.set(descriptor.name, completeDescriptor);

    // Update dependency graph
    this.updateDependencyGraph(descriptor.name, metadata.dependencies);

    // Check for circular dependencies
    if (this.config.enableCircularDependencyCheck) {
      this.checkCircularDependencies(descriptor.name);
    }

    this.eventBus.emit("service:registered", completeDescriptor);
  }

  private updateDependencyGraph(
    serviceName: string,
    dependencies: string[],
  ): void {
    this.dependencyGraph.set(serviceName, new Set(dependencies));
  }

  private checkCircularDependencies(serviceName: string): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (node: string): boolean => {
      if (recursionStack.has(node)) return true;
      if (visited.has(node)) return false;

      visited.add(node);
      recursionStack.add(node);

      const dependencies = this.dependencyGraph.get(node) || new Set();
      for (const dep of dependencies) {
        if (hasCycle(dep)) return true;
      }

      recursionStack.delete(node);
      return false;
    };

    if (hasCycle(serviceName)) {
      throw new Error(
        `Circular dependency detected involving service: ${serviceName}`,
      );
    }
  }

  async initializeService(serviceName: string): Promise<void> {
    if (this.initializationPromises.has(serviceName)) {
      return this.initializationPromises.get(serviceName);
    }

    const descriptor = this.services.get(serviceName);
    if (!descriptor) {
      throw new Error(`Service ${serviceName} not found`);
    }

    const initPromise = this.doInitializeService(descriptor);
    this.initializationPromises.set(serviceName, initPromise);

    try {
      await initPromise;
    } finally {
      this.initializationPromises.delete(serviceName);
    }
  }

  private async doInitializeService(
    descriptor: ServiceDescriptor,
  ): Promise<void> {
    const instance = this.instances.get(descriptor.name);
    if (instance && instance.lifecycle === ServiceLifecycle.INITIALIZED) {
      return;
    }

    try {
      // Create instance wrapper
      const wrapper: ServiceInstance = {
        service: null as any,
        metadata: descriptor.metadata,
        lifecycle: ServiceLifecycle.INITIALIZING,
        createdAt: Date.now(),
        metrics: {},
        errorCount: 0,
      };

      this.instances.set(descriptor.name, wrapper);
      this.eventBus.emit("service:initializing", wrapper);

      // Initialize dependencies first
      for (const depName of descriptor.metadata.dependencies) {
        await this.initializeService(depName);
      }

      // Create service instance
      wrapper.service = await descriptor.factory(this);
      wrapper.lifecycle = ServiceLifecycle.INITIALIZED;

      // Call initialize method if it exists
      if (wrapper.service.initialize) {
        await wrapper.service.initialize();
      }

      this.eventBus.emit("service:initialized", wrapper);

      // Start the service if auto-start is enabled
      if (this.isInitialized) {
        await this.startService(descriptor.name);
      }
    } catch (error) {
      const instance = this.instances.get(descriptor.name);
      if (instance) {
        instance.lifecycle = ServiceLifecycle.ERROR;
        instance.lastError = error as Error;
        instance.errorCount++;
      }
      throw error;
    }
  }

  async startService(serviceName: string): Promise<void> {
    const instance = this.instances.get(serviceName);
    if (!instance) {
      throw new Error(`Service ${serviceName} not found`);
    }

    if (instance.lifecycle === ServiceLifecycle.RUNNING) {
      return;
    }

    try {
      instance.lifecycle = ServiceLifecycle.STARTING;
      this.eventBus.emit("service:starting", instance);

      if (instance.service.start) {
        await instance.service.start();
      }

      instance.lifecycle = ServiceLifecycle.RUNNING;
      instance.startedAt = Date.now();
      this.eventBus.emit("service:started", instance);
    } catch (error) {
      instance.lifecycle = ServiceLifecycle.ERROR;
      instance.lastError = error as Error;
      instance.errorCount++;
      throw error;
    }
  }

  async stopService(serviceName: string): Promise<void> {
    const instance = this.instances.get(serviceName);
    if (!instance) {
      throw new Error(`Service ${serviceName} not found`);
    }

    if (instance.lifecycle === ServiceLifecycle.STOPPED) {
      return;
    }

    try {
      instance.lifecycle = ServiceLifecycle.STOPPING;
      this.eventBus.emit("service:stopping", instance);

      if (instance.service.stop) {
        await instance.service.stop();
      }

      instance.lifecycle = ServiceLifecycle.STOPPED;
      instance.stoppedAt = Date.now();
      this.eventBus.emit("service:stopped", instance);
    } catch (error) {
      instance.lifecycle = ServiceLifecycle.ERROR;
      instance.lastError = error as Error;
      instance.errorCount++;
      throw error;
    }
  }

  async getService<T extends IService>(
    serviceName: string,
    scopeId?: string,
  ): Promise<T> {
    const descriptor = this.services.get(serviceName);
    if (!descriptor) {
      throw new Error(`Service ${serviceName} not found`);
    }

    // Handle scoped services
    if (descriptor.metadata.scope === ServiceScope.SCOPED && scopeId) {
      return this.getScopedService<T>(serviceName, scopeId);
    }

    // Handle transient services
    if (descriptor.metadata.scope === ServiceScope.TRANSIENT) {
      return this.createTransientService<T>(descriptor);
    }

    // Handle singleton services
    const instance = this.instances.get(serviceName);
    if (!instance || instance.lifecycle === ServiceLifecycle.ERROR) {
      await this.initializeService(serviceName);
      return this.getService<T>(serviceName, scopeId);
    }

    return instance.service as T;
  }

  private getScopedService<T extends IService>(
    serviceName: string,
    scopeId: string,
  ): T {
    let scope = this.scopes.get(scopeId);
    if (!scope) {
      scope = this.createScope(scopeId);
      this.scopes.set(scopeId, scope);
    }

    if (scope.services.has(serviceName)) {
      return scope.services.get(serviceName) as T;
    }

    // Create new instance for this scope
    const descriptor = this.services.get(serviceName)!;
    const service = descriptor.factory(this);
    scope.services.set(serviceName, service);

    return service as T;
  }

  private createTransientService<T extends IService>(
    descriptor: ServiceDescriptor<T>,
  ): T {
    return descriptor.factory(this);
  }

  createScope(scopeId?: string): ScopeContext {
    const id = scopeId || this.generateScopeId();
    const scope: ScopeContext = {
      id,
      createdAt: Date.now(),
      services: new Map(),
      metadata: {},
    };

    this.scopes.set(id, scope);
    return scope;
  }

  destroyScope(scopeId: string): void {
    const scope = this.scopes.get(scopeId);
    if (scope) {
      // Dispose all scoped services
      for (const [name, service] of scope.services) {
        if (service.dispose) {
          service.dispose();
        }
      }
      this.scopes.delete(scopeId);
    }
  }

  private generateScopeId(): string {
    return `scope_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getServiceHealth(serviceName: string): Promise<ServiceHealth> {
    const instance = this.instances.get(serviceName);
    if (!instance) {
      throw new Error(`Service ${serviceName} not found`);
    }

    if (instance.service.healthCheck) {
      try {
        const health = await instance.service.healthCheck();
        instance.health = health;
        instance.lastHealthCheck = Date.now();
        return health;
      } catch (error) {
        return {
          status: "UNHEALTHY",
          timestamp: Date.now(),
          uptime: Date.now() - instance.createdAt,
          memoryUsage: process.memoryUsage().heapUsed,
          lastError: error as Error,
          metrics: instance.metrics,
          checks: [
            {
              name: "health_check",
              status: "FAIL",
              message: (error as Error).message,
              timestamp: Date.now(),
            },
          ],
        };
      }
    }

    // Default health check
    const uptime = Date.now() - instance.createdAt;
    return {
      status:
        instance.lifecycle === ServiceLifecycle.RUNNING ? "HEALTHY" : "UNKNOWN",
      timestamp: Date.now(),
      uptime,
      memoryUsage: process.memoryUsage().heapUsed,
      metrics: instance.metrics,
      checks: [
        {
          name: "lifecycle",
          status:
            instance.lifecycle === ServiceLifecycle.RUNNING ? "PASS" : "FAIL",
          message: `Service is ${instance.lifecycle}`,
          timestamp: Date.now(),
        },
      ],
    };
  }

  async getAllServicesHealth(): Promise<Record<string, ServiceHealth>> {
    const health: Record<string, ServiceHealth> = {};

    for (const serviceName of this.services.keys()) {
      try {
        health[serviceName] = await this.getServiceHealth(serviceName);
      } catch (error) {
        health[serviceName] = {
          status: "UNHEALTHY",
          timestamp: Date.now(),
          uptime: 0,
          memoryUsage: 0,
          lastError: error as Error,
          metrics: {},
          checks: [
            {
              name: "health_check",
              status: "FAIL",
              message: (error as Error).message,
              timestamp: Date.now(),
            },
          ],
        };
      }
    }

    return health;
  }

  private startHealthMonitoring(): void {
    this.healthCheckTimer = setInterval(async () => {
      try {
        const healthStatus = await this.getAllServicesHealth();
        this.emit("health:check", healthStatus);

        // Check for unhealthy services
        for (const [serviceName, health] of Object.entries(healthStatus)) {
          const instance = this.instances.get(serviceName);
          if (instance && instance.health?.status !== health.status) {
            instance.health = health;
            this.eventBus.emit("service:health:changed", instance);
          }
        }
      } catch (error) {
        console.error("Health check failed:", error);
      }
    }, this.config.healthCheckInterval);
  }

  private startMetricsCollection(): void {
    this.metricsTimer = setInterval(async () => {
      try {
        const metrics: Record<string, Record<string, number>> = {};

        for (const [serviceName, instance] of this.instances) {
          if (instance.service.getMetrics) {
            try {
              const serviceMetrics = await instance.service.getMetrics();
              metrics[serviceName] = { ...instance.metrics, ...serviceMetrics };
              instance.metrics = metrics[serviceName];
            } catch (error) {
              console.error(
                `Failed to get metrics for service ${serviceName}:`,
                error,
              );
            }
          }
        }

        this.emit("metrics:collected", metrics);
      } catch (error) {
        console.error("Metrics collection failed:", error);
      }
    }, this.config.metricsInterval);
  }

  async shutdown(): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    try {
      this.emit("shutting_down");

      // Stop health monitoring and metrics collection
      if (this.healthCheckTimer) {
        clearInterval(this.healthCheckTimer);
      }
      if (this.metricsTimer) {
        clearInterval(this.metricsTimer);
      }

      // Stop all services in reverse priority order
      const services = Array.from(this.instances.values()).sort(
        (a, b) => b.metadata.priority - a.metadata.priority,
      );

      const stopPromises = services.map(async (instance) => {
        try {
          await this.stopService(instance.service.name);
        } catch (error) {
          console.error(
            `Failed to stop service ${instance.service.name}:`,
            error,
          );
        }
      });

      await Promise.all(stopPromises);

      // Dispose all services
      const disposePromises = services.map(async (instance) => {
        try {
          if (instance.service.dispose) {
            await instance.service.dispose();
          }
          instance.lifecycle = ServiceLifecycle.DISPOSED;
        } catch (error) {
          console.error(
            `Failed to dispose service ${instance.service.name}:`,
            error,
          );
        }
      });

      await Promise.all(disposePromises);

      // Destroy all scopes
      for (const scopeId of this.scopes.keys()) {
        this.destroyScope(scopeId);
      }

      this.emit("shutdown_complete");
    } catch (error) {
      this.emit("shutdown_error", error);
      throw error;
    }
  }

  getRegisteredServices(): string[] {
    return Array.from(this.services.keys());
  }

  getRunningServices(): string[] {
    return Array.from(this.instances.values())
      .filter((instance) => instance.lifecycle === ServiceLifecycle.RUNNING)
      .map((instance) => instance.service.name);
  }

  getServiceMetadata(serviceName: string): ServiceMetadata | undefined {
    return this.services.get(serviceName)?.metadata;
  }

  getServiceInstance(serviceName: string): ServiceInstance | undefined {
    return this.instances.get(serviceName);
  }

  emit(eventName: string, ...args: any[]): boolean {
    if (this.config.enableEventBus) {
      this.eventBus.emit(eventName, ...args);
    }
    return super.emit(eventName, ...args);
  }

  on(eventName: string, listener: (...args: any[]) => void): this {
    if (this.config.enableEventBus) {
      this.eventBus.on(eventName, listener);
    }
    return super.on(eventName, listener);
  }

  off(eventName: string, listener: (...args: any[]) => void): this {
    if (this.config.enableEventBus) {
      this.eventBus.off(eventName, listener);
    }
    return super.off(eventName, listener);
  }
}

// Factory function to create enterprise service container
export function createEnterpriseServiceContainer(
  environment: EnterpriseEnvironmentConfig,
  config?: Partial<ContainerConfig>,
): EnterpriseServiceContainer {
  return new EnterpriseServiceContainer(environment, config);
}

// Global container instance
let globalContainer: EnterpriseServiceContainer;

export function getGlobalContainer(): EnterpriseServiceContainer {
  if (!globalContainer) {
    throw new Error("Global service container not initialized");
  }
  return globalContainer;
}

export function setGlobalContainer(
  container: EnterpriseServiceContainer,
): void {
  globalContainer = container;
}

// Decorator for service registration
export function Service(options: Partial<ServiceMetadata> = {}) {
  return function <T extends { new (...args: any[]): IService }>(
    constructor: T,
  ) {
    const serviceName = options.name || constructor.name.toLowerCase();

    return class extends constructor {
      static readonly serviceName = serviceName;
      static readonly metadata = {
        name: serviceName,
        version: "1.0.0",
        ...options,
      } as ServiceMetadata;
    };
  };
}

// Decorator for dependency injection
export function Inject(serviceName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const container = getGlobalContainer();
      const service = await container.getService(serviceName);
      return originalMethod.apply(this, [service, ...args]);
    };

    return descriptor;
  };
}
