import type { PDFElementInterface, StyleOptions, SpacingOptions } from "../types/elements/PDFElement";
import { v4 as uuidv4 } from "uuid";

export interface ElementPosition {
  start: { x: number; y: number };
  end: { x: number; y: number };
  pageIndex: number;
  absolute?: {
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
}

export abstract class PDFElement implements PDFElementInterface {
  id: string;
  abstract type: string;
  style?: StyleOptions;
  position?: ElementPosition;

  constructor(style?: StyleOptions, id?: string) {
    this.id = id ?? uuidv4();
    this.style = style;
  }

  getSize(): { width: number; height: number } {
    const width = this.getComputedWidth();
    const height = this.getComputedHeight();
    return { width, height };
  }

  protected getComputedWidth(): number {
    const padding = this.resolveSpacing(this.style?.padding);
    const margin = this.resolveSpacing(this.style?.margin);

    return (
      (this.style?.width ?? this.contentWidth()) +
      padding.left + padding.right +
      margin.left + margin.right
    );
  }

  protected getComputedHeight(): number {
    const padding = this.resolveSpacing(this.style?.padding);
    const margin = this.resolveSpacing(this.style?.margin);

    return (
      (this.style?.height ?? this.contentHeight()) +
      padding.top + padding.bottom +
      margin.top + margin.bottom
    );
  }

  protected resolveSpacing(spacing?: number | SpacingOptions): Required<SpacingOptions> {
    if (typeof spacing === "number") {
      return { top: spacing, right: spacing, bottom: spacing, left: spacing };
    }
    return {
      top: spacing?.top ?? 0,
      right: spacing?.right ?? 0,
      bottom: spacing?.bottom ?? 0,
      left: spacing?.left ?? 0,
    };
  }

  /**
   * Subclasses must provide a content-based width estimate
   */
  protected abstract contentWidth(): number;

  /**
   * Subclasses must provide a content-based height estimate
   */
  protected abstract contentHeight(): number;
}
