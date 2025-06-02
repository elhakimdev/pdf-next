import { PDFDocument as PDFLibDocument, rgb } from "pdf-lib";
import type { PDFDocumentInterface } from "../types/core/PDFDocument";
import type { PDFPageInterface } from "../types/core/PDFPage";
import type { PDFElementInterface } from "../types/elements/PDFElement";
import { PDFTextElement } from "../elements/PDFTextElement";
import { PDFRenderer } from "./PDFRenderer";

export class PDFLibRenderer extends PDFRenderer {
  private pdfDoc: PDFLibDocument;
  private currentPage: any;

  constructor(document: PDFDocumentInterface, engine: any) {
    super(document);
    this.pdfDoc = engine;
  }

  protected override async beforeRender(): Promise<void> {
    // You can set metadata here if needed
    const meta = this.document.metadata;
    if (meta) {
      this.pdfDoc.setTitle(meta.title ?? "");
      this.pdfDoc.setAuthor(meta.author ?? "");
    }
  }

  protected override async afterRender(): Promise<Uint8Array|void> {
    return await this.pdfDoc.save();
  }

  protected override async renderPageStart(page: PDFPageInterface): Promise<void> {
    const pdfPage = this.pdfDoc.addPage([page.width, page.height]);
    this.currentPage = pdfPage;
  }

  protected override async renderPageEnd(_page: PDFPageInterface): Promise<void> {
    this.currentPage = null;
  }

  protected override async renderElement(element: PDFElementInterface): Promise<void> {
    if (element.type === "text") {
      await this.renderTextElement(element as PDFTextElement);
    }
    // Handle other element types here (e.g., images, shapes, etc.)
  }

  private async renderTextElement(element: PDFTextElement): Promise<void> {
    if (!this.currentPage || !element.position) return;

    const { x, y } = element.position.start;
    const fontSize = element.style?.fontSize ?? 12;
    const color = element.style?.color ?? "#000000";
    const rgbColor = this.hexToRgb(color);

    this.currentPage.drawText(element.text, {
      x,
      y: this.currentPage.getHeight() - y - fontSize,
      size: fontSize,
      color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
    });
  }

  private hexToRgb(hex: string) {
    const match = hex.replace("#", "").match(/.{1,2}/g);
    if (!match) return { r: 0, g: 0, b: 0 };
    const [r, g, b] = match.map((x) => parseInt(x, 16) / 255);
    return { r, g, b };
  }

  public async save(): Promise<Uint8Array> {
    return await this.afterRender() as unknown as Promise<Uint8Array>;
  }
}
