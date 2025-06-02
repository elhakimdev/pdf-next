import type { PDFElementInterface } from "./PDFElement";

/**
 * Image element, specified by source data or URL.
 */
export interface PDFImageElementInterface extends PDFElementInterface {
  type: 'image';
  /** Source of the image (URL, base64 string, or binary). */
  src: string | ArrayBuffer;
  /** Desired width (optional; otherwise natural width). */
  width?: number;
  /** Desired height (optional; otherwise natural height). */
  height?: number;
  /** Alternative text or description. */
  altText?: string;
}