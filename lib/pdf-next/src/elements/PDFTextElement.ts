import type { StyleOptions } from "../types/elements/PDFElement";
import { PDFElement } from "./PDFElement";
export interface TextStyleOptions extends StyleOptions {
  maxWidth?: number;
  align?: 'left' | 'center' | 'right' | 'justify';
  direction?: 'row' | 'column';
  gap?: number;
}
export class PDFTextElement extends PDFElement {
  type = "text";
  text: string;

  constructor(text: string, style?: TextStyleOptions, id?: string) {
    super(style, id);
    this.text = text;
  }
  
  protected override contentWidth(): number {
    const fontSize = this.style?.fontSize ?? 12;
    const letterSpacing = this.style?.letterSpacing ?? 0;
    const charWidth = fontSize * 0.5 + letterSpacing;
    return this.text.length * charWidth;
  }

  protected override contentHeight(): number {
    const fontSize = this.style?.fontSize ?? 12;
    const lineHeight = this.style?.lineHeight ?? 1.2;
    return fontSize * lineHeight;
  }
}
