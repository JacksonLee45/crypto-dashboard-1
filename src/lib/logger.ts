// src/lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogPayload {
  message: string;
  [key: string]: any;
}

class Logger {
  private context: string;
  private static logLevel: LogLevel = 'info'; // Default log level

  constructor(context: string) {
    this.context = context;
  }

  // Set the global log level
  static setLogLevel(level: LogLevel): void {
    Logger.logLevel = level;
  }

  // Get current log level
  static getLogLevel(): LogLevel {
    return Logger.logLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };

    return levels[level] >= levels[Logger.logLevel];
  }

  private formatPayload(payload: LogPayload): string {
    try {
      return JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
        context: this.context,
        level: 'info',
      });
    } catch (error) {
      return JSON.stringify({
        message: 'Error formatting log payload',
        error: String(error),
        timestamp: new Date().toISOString(),
        context: this.context,
        level: 'error',
      });
    }
  }

  debug(message: string, meta: Record<string, any> = {}): void {
    if (!this.shouldLog('debug')) return;
    
    console.debug(this.formatPayload({ message, level: 'debug', ...meta }));
  }

  info(message: string, meta: Record<string, any> = {}): void {
    if (!this.shouldLog('info')) return;
    
    console.info(this.formatPayload({ message, level: 'info', ...meta }));
  }

  warn(message: string, meta: Record<string, any> = {}): void {
    if (!this.shouldLog('warn')) return;
    
    console.warn(this.formatPayload({ message, level: 'warn', ...meta }));
  }

  error(message: string, meta: Record<string, any> = {}): void {
    if (!this.shouldLog('error')) return;
    
    console.error(this.formatPayload({ message, level: 'error', ...meta }));
  }

  // Add request/response logging helpers for API routes
  logRequest(req: any, meta: Record<string, any> = {}): void {
    const { url, method, headers, query, body } = req;
    
    this.info('API Request', {
      url,
      method,
      query,
      headers: {
        'user-agent': headers['user-agent'],
        'content-type': headers['content-type'],
        'x-request-id': headers['x-request-id'] || 'none',
      },
      body: body ? '(body present)' : undefined,
      ...meta
    });
  }

  logResponse(statusCode: number, responseTime: number, meta: Record<string, any> = {}): void {
    this.info('API Response', {
      statusCode,
      responseTime: `${responseTime}ms`,
      ...meta
    });
  }

  // Explicitly log cache operations
  logCacheHit(key: string, meta: Record<string, any> = {}): void {
    this.debug('Cache hit', {
      key,
      ...meta
    });
  }

  logCacheMiss(key: string, meta: Record<string, any> = {}): void {
    this.debug('Cache miss', {
      key,
      ...meta
    });
  }

  logCacheSet(key: string, ttl: number, meta: Record<string, any> = {}): void {
    this.debug('Cache set', {
      key,
      ttl: `${ttl}s`,
      ...meta
    });
  }
}

// Export a function to create a new logger instance
export const createLogger = (context: string): Logger => {
  return new Logger(context);
};

// Set log level based on environment
if (process.env.NODE_ENV === 'development') {
  Logger.setLogLevel('debug');
} else {
  Logger.setLogLevel('info');
}

export default Logger;
