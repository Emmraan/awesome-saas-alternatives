declare module "next-themes" {
  import * as React from "react";
  export function ThemeProvider(props: {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    storageKey?: string;
  }): React.JSX.Element;
  export function useTheme(): {
    theme: string | undefined;
    resolvedTheme: string | undefined;
    setTheme: (theme: string) => void;
    systemTheme?: string;
  };
}
