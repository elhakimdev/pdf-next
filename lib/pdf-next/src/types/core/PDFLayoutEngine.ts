import type { PDFDocumentInterface } from "./PDFDocument";

export interface LayoutEngine {
  setup(document: PDFDocumentInterface): void;
}