import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("app:ready", onChange);
  return () => window.removeEventListener("app:ready", onChange);
}

/** True once the preloader has finished (`app:ready`). Always false on the server. */
export function useAppReady() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.ready === "true",
    () => false
  );
}
