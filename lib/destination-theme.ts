import type { CSSProperties } from "react";
import type { Destination } from "@/data/destinations";

type DestinationThemeStyle = CSSProperties & {
  "--camp-theme-background": string;
  "--camp-theme-text": string;
  "--camp-content-background": string;
  "--camp-content-text": string;
  "--camp-surface": string;
  "--camp-muted": string;
  "--camp-line": string;
  "--camp-accent": string;
};

export function getDestinationThemeStyle(
  destination: Pick<
    Destination,
    | "accent"
    | "themeBackground"
    | "themeText"
    | "contentBackground"
    | "contentText"
    | "mutedColor"
    | "lineColor"
  >,
): DestinationThemeStyle {
  return {
    "--camp-theme-background": destination.themeBackground,
    "--camp-theme-text": destination.themeText,
    "--camp-content-background": destination.contentBackground,
    "--camp-content-text": destination.contentText,
    "--camp-surface": destination.themeBackground,
    "--camp-muted": destination.mutedColor,
    "--camp-line": destination.lineColor,
    "--camp-accent": destination.accent,
  };
}
