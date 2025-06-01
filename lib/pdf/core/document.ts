import { PDFDocument, PDFPage }  from "pdf-lib"
import type { Cursor, Margin, PdfConfig } from "./types";
import type { PdfElement } from "../elements/base";
import { createPreview, printPdf, downloadPdf } from "../utilities/previewer";
import { mmToPt } from "../utilities/converter";
import fontkit from '@pdf-lib/fontkit';

export abstract class PdfReportDocument<T> {
  protected data: T;
  protected document: PDFDocument;
  protected page?: PDFPage;
  protected cursor: Cursor;
  protected elements: PdfElement[];
  private isDefined: boolean = false;
  protected configs?: PdfConfig;
  constructor(
    data: T,
    doc: PDFDocument,
    configs?: PdfConfig | undefined
  ){
    this.data = data;
    this.document = doc;
    this.cursor = {
      x: 0,
      y: 0
    },
    this.configs = {...configs}
    this.elements = [];
  }

  private async ensureDefined(): Promise<void> {
    if (!this.isDefined) {
      await this.define(); // defined by subclasses
      this.isDefined = true;
    }
  }

  private initCursor(
    pageWidth: number,
    pageHeight: number,
    margin: Partial<Margin> = {}
  ): Cursor {
    const defaultMargin: Margin = { top: mmToPt(10), right: mmToPt(10), bottom: mmToPt(10), left: mmToPt(10) };
    // Merge default margins with user overrides
    const m = { ...defaultMargin, ...margin };

    return {
      x: m.left,
      y: pageHeight - m.top, // start near top-left inside margin
    };
  }

private async build(): Promise<void> {
  this.document.registerFontkit(fontkit);

  this.initNewPage();

  await this.ensureDefined();


  for (const element of this.elements) {
    // Estimate required height for the element (you must have a method or a fixed value)
    // Let's say element.getHeight(cursor) returns required height in pts
    const requiredHeight = element.getHeight() ?? 50; // fallback 50pt if unknown

    // Check if writing this element exceeds page bottom margin/height
    // Add new page and reset cursor.y to top margin
    if (this.cursor.y - requiredHeight  < (this.configs?.page?.margin ?? 40)) {
      this.initNewPage()
    }

    await element.write(this.document, this.page!, this.cursor);

    // Update cursor.y after writing element (you can do this inside element.write or here)
    // Assuming element.write updates cursor.y internally
  }
}
  private initNewPage() {
    const defaultA4 = {
      width: this.configs?.page?.orientation === "landscape" ? mmToPt(297) : mmToPt(210),
      height: this.configs?.page?.orientation === "landscape" ? mmToPt(210) : mmToPt(297),
    };

    this.page = this.document.addPage([defaultA4.width, defaultA4.height]);
    this.cursor = this.initCursor(defaultA4.width, defaultA4.height, this.configs?.page?.margin as {});
  }

  async getBytes() {
    await this.build();
    return await this.document.save();
  }

  protected abstract define(): Promise<any>;
}