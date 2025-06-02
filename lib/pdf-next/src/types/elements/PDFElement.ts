import type { ElementPosition } from "../../elements/PDFElement";

/**
 * Spacing amounts (for margin or padding).
 */
export interface SpacingOptions {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface StyleOptions {
  /** Explicit width (in points or units). */
  width?: number;
  /** Explicit height. */
  height?: number;
  /** Margin around the element. Can be a number (uniform) or object. */
  margin?: number | SpacingOptions;
  /** Padding inside the element. */
  padding?: number | SpacingOptions;
  /** Font size (for text). */
  fontSize?: number;
  /** Font family (e.g. "Helvetica", "Arial"). */
  fontFamily?: string;
  /** Font weight (e.g. "normal", "bold"). */
  fontWeight?: string | number;
  /** Text color (e.g. "#000000"). */
  color?: string;
  /** Background color of the element. */
  backgroundColor?: string;
  /** Text alignment for paragraphs/headings. */
  textAlign?: 'left' | 'right' | 'center' | 'justify';
  /** Line height multiplier (e.g. 1.2 for 120%). */
  lineHeight?: number;
  /** Letter spacing (gap between characters). */
  letterSpacing?: number;
  // Additional style properties as needed...
}

/**
 * Base interface for all elements placed in the document.
 */
export interface PDFElementInterface {
  /** Unique element identifier. */
  id: string;
  /** Discriminator for element type (e.g. 'text', 'image', etc.). */
  type: string;
  /** Style and layout options for this element. */
  style?: StyleOptions;
  position?: ElementPosition;
  getSize(): {width: number, height: number}
}

