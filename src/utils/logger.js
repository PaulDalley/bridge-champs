/**
 * Logger utility - Only logs in development, silent in production
 * Replace all console.log with logger.log, console.error with logger.error, etc.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args) => {
    // Always log errors, but could send to error tracking service in production
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, you might want to send to error tracking service
      // Example: Sentry.captureException(...args);
      console.error(...args);
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};

export default logger;

