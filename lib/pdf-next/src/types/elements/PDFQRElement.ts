import type { PDFElementInterface } from "./PDFElement";

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
/**
 * QR code element with content string.
 */
export interface PDFQRElementInterface extends PDFElementInterface {
  type: 'qr';
  /** Content/data to encode in the QR code. */
  content: string;
  /** Size of the QR code (in points). */
  size?: number;
  /** Error correction level ('L','M','Q','H'). */
  errorCorrectionLevel?: ErrorCorrectionLevel
}