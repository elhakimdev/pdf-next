import type { PDFDocumentInterface } from "../../../types/core/PDFDocument";
import type { PDFPageInterface } from "../../../types/core/PDFPage";

export interface PDFDocumentLifecycleEvents {
  beforeAddElement: { document: PDFDocumentInterface, elementId: string };
  afterAddElement: { document: PDFDocumentInterface, elementId: string; pageIndex: number };
  beforeAddPage: { document: PDFDocumentInterface, page: PDFPageInterface, pageIndex: number };
  afterAddPage: { document: PDFDocumentInterface, page: PDFPageInterface, pageIndex: number };
}
