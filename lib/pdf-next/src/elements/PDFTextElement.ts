import type { StyleOptions } from "../types/elements/PDFElement";
import { PDFElement } from "./PDFElement";

export class PDFTextElement extends PDFElement {
  type = "text";
  text: string;

  constructor(text: string, style?: StyleOptions, id?: string) {
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
