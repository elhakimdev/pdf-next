import type { PDFElementInterface } from "./PDFElement";

/**
 * Section element that can contain multiple child elements.
 */
export interface PDFSectionElement extends PDFElementInterface {
  type: 'section';
  /** Child elements within this section. */
  children: PDFElementInterface[];
}