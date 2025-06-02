import type { PDFElementInterface } from "./PDFElement";
import type { PDFTextElementInterface } from "./PDFTextElement";

/**
 * Heading element (e.g. H1, H2) with specified level.
 */
export interface PDFHeadingElementInterface extends PDFElementInterface {
  type: 'heading';
  /** Text of the heading. */
  text: string;
  /** Heading level (1 = H1, 2 = H2, etc.). */
  level: number;
}