import type { DocumentMetadata, PDFDocumentInterface } from "../types/core/PDFDocument";
import { PageOrientation, type PDFPageInterface } from "../types/core/PDFPage";
import type { PDFElementInterface, SpacingOptions } from "../types/elements/PDFElement";
import { PDFCursorManager } from "./PDFCursorManager";
import { PDFPage } from "./PDFPage";

export class PDFDocument implements PDFDocumentInterface {
  pages: PDFPageInterface[] = [];
  metadata?: DocumentMetadata | undefined;
  pageCount: number = 0;
  cursor: PDFCursorManager;
  defaultOrientation: PageOrientation = PageOrientation.Portrait;

  constructor(
    initialWidth = 595,  // e.g., A4 width pt
    initialHeight = 842, // e.g., A4 height pt
    orientation: PageOrientation = PageOrientation.Portrait,
    margins?: SpacingOptions,
  ) {
    this.cursor = new PDFCursorManager(
      margins?.top ?? 0,
      margins?.left ?? 0,
      "LTR",
      "vertical"
    );

    // swap size if landscape
    if (this.defaultOrientation === PageOrientation.Landscape) {
      [initialWidth, initialHeight] = [initialHeight, initialWidth];
    }

    this.addPage(initialWidth, initialHeight, orientation ?? this.defaultOrientation, margins);
  }

  getPages(): PDFPageInterface[] {
    return this.pages;
  }

  addPage(width: number, height: number, orientation: PageOrientation = PageOrientation.Portrait, margins?: SpacingOptions, ): PDFPageInterface {

    const [w, h] = orientation === PageOrientation.Landscape ? [height, width] : [width, height];

    const pageCursor = new PDFCursorManager(
      margins?.top ?? 0,
      margins?.left ?? 0,
      this.cursor.direction,
      this.cursor.flexDirection
    );
    const page = new PDFPage(w, h, pageCursor, orientation, margins);
    this.pages.push(page);
    this.pageCount = this.pages.length;

    // Reset global cursor to start of new page
    this.cursor.reset();

    return page;
  }

  removePage(index: number): void {
    if (index >= 0 && index < this.pages.length) {
      this.pages.splice(index, 1);
      this.pageCount = this.pages.length;
    }
  }

  getPage(index: number): PDFPageInterface | undefined {
    return this.pages[index];
  }

  addElement(element: PDFElementInterface): void {
    if (this.pages.length === 0) throw new Error("No pages in document");

    let currentPage = this.pages[this.pages.length - 1];
    const pageIndex = this.pages.length - 1;

    if (!currentPage.canFit(element, this.cursor)) {
      this.addPage(currentPage.width, currentPage.height, currentPage.orientation, currentPage.margins);
      currentPage = this.pages[this.pages.length - 1];
    }

    const size = element.getSize();
    const startX = this.cursor.x;
    const startY = this.cursor.y;
    const endX = startX + size.width;
    const endY = startY + size.height;

    const pageHeights = this.pages.map(p => p.height);
    const absStart = this.cursor.getAbsolutePosition(pageIndex, pageHeights);
    const absEnd = { x: endX, y: absStart.y + size.height };

    element.position = {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      pageIndex,
      absolute: {
        start: absStart,
        end: absEnd
      }
    };

    currentPage.addElement(element);
    this.cursor.advanceBySize(size);
  }
}