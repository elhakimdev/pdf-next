import type { PDFElementInterface, SpacingOptions } from "../elements/PDFElement";
import type { PDFCursorManagerInterface } from "./PDFCursorManager";
export enum PageOrientation {
  Portrait = 'portrait',
  Landscape = 'landscape'
}
export interface PDFPageInterface {
  width: number;
  height: number;
  orientation: PageOrientation; 
  margins?: SpacingOptions,
  elements?: PDFElementInterface[];
  cursor: PDFCursorManagerInterface;
  addElement(element: PDFElementInterface): void;
  removeElement(element: PDFElementInterface): void;
  canFit(element: PDFElementInterface, cursor: PDFCursorManagerInterface): boolean;
}