// Small logger utility to centralize debug output.
// In production we no-op debug/info to avoid noisy logs.
// Use Vite's import.meta.env.PROD when available. Avoid direct `process` reference
// so linters don't complain in browser-focused configs.
const isProd = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.PROD;

const noop = () => {};

const logger = {
  debug: isProd ? noop : (...args) => console.log(...args),
  info: isProd ? noop : (...args) => console.info(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
  table: isProd ? noop : (...args) => console.table(...args),
  trace: isProd ? noop : (...args) => console.trace(...args),
};

export default logger;
