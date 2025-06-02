import type { PDFCursorManagerInterface } from "../types/core/PDFCursorManager";
import type { PageOrientation, PDFPageInterface } from "../types/core/PDFPage";
import type { SpacingOptions, PDFElementInterface } from "../types/elements/PDFElement";

export class PDFPage implements PDFPageInterface {
  width: number;
  height: number;
  margins?: SpacingOptions;
  elements: PDFElementInterface[] = [];
  cursor: PDFCursorManagerInterface;
  orientation: PageOrientation;

  constructor(
    width: number,
    height: number,
    cursor: PDFCursorManagerInterface,
    orientation: PageOrientation,
    margins?: SpacingOptions
  ) {
    this.width = width;
    this.height = height;
    this.cursor = cursor;
    this.margins = margins;
    this.orientation = orientation;
  }

  addElement(element: PDFElementInterface): void {
    this.elements.push(element);
    this.cursor.advanceBySize(element.getSize());
  }

  removeElement(element: PDFElementInterface): void {
    const index = this.elements.indexOf(element);
    if (index !== -1) {
      this.elements.splice(index, 1);
    }
  }

  canFit(element: PDFElementInterface, cursor: PDFCursorManagerInterface): boolean {
    if(cursor.flexDirection === "vertical") {
      // Check if element height fits inside page height minus current cursor y and bottom margin
      const bottomMargin = (typeof this.margins === 'object' && this.margins.bottom) || 0;
      const {bottomMargin: bm, cursorY, elSize, height} = {bottomMargin, cursorY: cursor.y, elSize: element.getSize().height, height: this.height};
      return cursor.y + element.getSize().height <= this.height - bottomMargin;
    } else {
      // For horizontal flow, check width fits
      const rightMargin = (typeof this.margins === 'object' && this.margins.right) || 0;
      return cursor.x + element.getSize().width <= this.width - rightMargin;
    }
  }
}