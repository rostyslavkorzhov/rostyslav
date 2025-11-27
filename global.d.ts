// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

// EyeDropper API type declaration (not available in all TypeScript versions)
interface EyeDropper {
  open(): Promise<{ sRGBHex: string }>;
}

declare global {
  const EyeDropper: {
    new (): EyeDropper;
  } | undefined;
}
