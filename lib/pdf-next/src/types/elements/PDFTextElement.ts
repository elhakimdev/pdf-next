import type { PDFElementInterface } from "./PDFElement";

/**
 * Text element for inline or small text chunks.
 */
export interface PDFTextElementInterface extends PDFElementInterface {
  type: 'text';
  /** The text content to render. */
  text: string;
}
