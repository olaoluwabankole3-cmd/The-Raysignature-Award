import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

// Intercept and silence third-party extension/wallet errors (e.g. MetaMask "Sender: Failed to get initial state")
// as early as possible in the script loading lifecycle to prevent overlay display or app interruption.
(() => {
  const isIgnoredError = (str: string) => {
    if (!str) return false;
    const lower = str.toLowerCase();
    return (
      lower.includes("sender: failed to get initial state") ||
      lower.includes("failed to get initial state") ||
      lower.includes("metamask") ||
      lower.includes("ethereum")
    );
  };

  const handleGlobalError = (event: ErrorEvent) => {
    const message = event.message || "";
    const errorMsg = event.error?.message || "";
    const errorStack = event.error?.stack || "";
    const errorStr = (event.error?.toString?.() || "");

    if (
      isIgnoredError(message) ||
      isIgnoredError(errorMsg) ||
      isIgnoredError(errorStack) ||
      isIgnoredError(errorStr)
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const reasonMsg = event.reason?.message || "";
    const reasonStack = event.reason?.stack || "";
    const reasonStr = String(event.reason || "");

    if (
      isIgnoredError(reasonMsg) ||
      isIgnoredError(reasonStack) ||
      isIgnoredError(reasonStr)
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  window.addEventListener("error", handleGlobalError, true);
  window.addEventListener("unhandledrejection", handleUnhandledRejection, true);
})();

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
