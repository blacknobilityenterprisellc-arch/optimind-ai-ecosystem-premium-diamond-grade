/**
 * OptiMind AI Ecosystem - Logger Utility
 * Premium Diamond Grade Logging System
 * 
 * A comprehensive logging utility for the OptiMind AI Ecosystem
 * with support for different log levels, structured logging,
 * and enterprise-grade features.
 * 
 * @version 2.0.0
 * @author OptiMind AI Ecosystem Team
 * @license MIT
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  stack?: string;
}

export class Logger {
  private name: string;
  private level: LogLevel;
  private entries: LogEntry[] = [];

  constructor(name: string, level: LogLevel = LogLevel.INFO) {
    this.name = name;
    this.level = level;
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      timestamp: new Date(),
      level,
      message,
      context,
      stack: error?.stack
    };
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (level < this.level) return;

    const entry = this.createLogEntry(level, message, context, error);
    this.entries.push(entry);

    // Format log message for console output
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[level];
    const prefix = `[${timestamp}] [${levelName}] [${this.name}]`;
    
    const logMessage = error 
      ? `${prefix} ${message}\n${error.stack || error.message}`
      : `${prefix} ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage);
        break;
      case LogLevel.INFO:
        console.info(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logMessage);
        break;
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level === undefined) {
      return [...this.entries];
    }
    return this.entries.filter(entry => entry.level >= level);
  }

  clearLogs(): void {
    this.entries = [];
  }

  static create(name: string, level?: LogLevel): Logger {
    return new Logger(name, level);
  }
}

// Default logger instance
export const logger = Logger.create('OptiMindAI');