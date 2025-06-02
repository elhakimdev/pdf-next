import type { PDFElementInterface } from "./PDFElement";

/**
 * Paragraph element for a block of text (with automatic wrapping).
 */
export interface PDFParagraphElementInterface extends PDFElementInterface {
  type: 'paragraph';
  /** Full content of the paragraph. */
  content: string;
}