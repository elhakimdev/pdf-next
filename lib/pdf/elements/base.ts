import type { PDFDocument, PDFPage } from "pdf-lib";
import type { Cursor } from "../core/types";

export abstract class PdfElement {
  abstract write(doc: PDFDocument, page: PDFPage, cursor: Cursor): Promise<void>;
  abstract getHeight(): number;
}