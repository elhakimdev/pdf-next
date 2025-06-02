import type { PDFElementInterface } from "../elements/PDFElement";
import type { PDFCursorManagerInterface } from "./PDFCursorManager";
import type { PageOrientation, PDFPageInterface } from "./PDFPage";

/**
 * Optional metadata for a PDF document.
 */
export interface DocumentMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
}

export interface PDFDocumentInterface {
  /** Pages contained in the document. */
  pages: PDFPageInterface[];
  /** Optional metadata (title, author, etc.). */
  metadata?: DocumentMetadata;
  /** Total number of pages. */
  pageCount: number;
  /**
   * Add a new page with specified dimensions and margins.
   * Returns the newly created Page.
   */
  addPage(width: number, height: number, orientation: PageOrientation, margins?: { top: number; right: number; bottom: number; left: number }): PDFPageInterface;
  /** Remove a page by its index. */
  removePage(index: number): void;
  /** Get a page by index (0-based), or undefined if not found. */
  getPage(index: number): PDFPageInterface | undefined;
  getPages(): PDFPageInterface[];
}