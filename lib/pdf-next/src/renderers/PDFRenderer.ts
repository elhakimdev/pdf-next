import type { PDFDocumentInterface } from "../types/core/PDFDocument";
import type { PDFElementInterface } from "../types/elements/PDFElement";

export abstract class PDFRenderer {
  protected document: PDFDocumentInterface;

  constructor(document: PDFDocumentInterface) {
    this.document = document;
  }

  // Point of entry
  public async render(): Promise<void> {
    await this.beforeRender();
    for (const page of this.document.getPages()) {
      await this.renderPageStart(page);
      for (const element of page.elements ?? []) {
        await this.renderElement(element);
      }
      await this.renderPageEnd(page);
    }
    await this.afterRender();
  }

  protected async beforeRender(): Promise<void> {}
  protected async afterRender(): Promise<any> {}

  protected abstract renderPageStart(page: any):  Promise<void> | void;
  protected abstract renderPageEnd(page: any):  Promise<void> | void;

  protected abstract renderElement(element: PDFElementInterface): Promise<void> | void;
}
