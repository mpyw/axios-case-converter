// Helpers for temporarily overriding global objects (FormData, URLSearchParams,
// Blob, navigator) while simulating legacy/React Native environments in tests.
//
// Starting with Node.js 26 some of these globals (e.g. URLSearchParams) are
// exposed as non-configurable properties, so `delete global.X` throws and the
// old cleanup left the environment half torn down. Snapshotting the original
// descriptors and restoring them defensively keeps the tests working across all
// supported Node.js versions.

type GlobalKey = string;

interface Snapshot {
  key: GlobalKey;
  existed: boolean;
  descriptor?: PropertyDescriptor;
}

const snapshots: Snapshot[] = [];

// Record the current state of a global before it gets overwritten so it can be
// restored later regardless of whether the property is configurable.
export const captureGlobal = (key: GlobalKey): void => {
  snapshots.push({
    key,
    existed: key in globalThis,
    descriptor: Object.getOwnPropertyDescriptor(globalThis, key),
  });
};

// Restore every captured global to its original state. Non-configurable native
// globals (Node.js >= 26) cannot be redefined or deleted; any polyfill
// assignment against them was a no-op for the same reason, so tolerating the
// failure leaves the original value intact.
export const restoreGlobals = (): void => {
  while (snapshots.length > 0) {
    const { key, existed, descriptor } = snapshots.pop() as Snapshot;
    try {
      if (existed && descriptor) {
        Object.defineProperty(globalThis, key, descriptor);
      } else if (!existed) {
        delete (globalThis as Record<string, unknown>)[key];
      }
    } catch {
      // Non-configurable native global — leave it as-is.
    }
  }
};
