import type { PDFElementInterface } from "../elements/PDFElement";

export type FlexDirection = "vertical" | "horizontal";
export type TextDirection = "LTR" | "RTL";
export interface PDFCursorManagerInterface {
  x: number;
  y: number;
  lineHeight: number;
  direction: TextDirection;
  flexDirection: FlexDirection;
  moveTo(x: number, y: number): void;
  moveUp(x: number, y: number): void;
  moveDown(x: number, y: number): void;
  moveLeft(x: number, y: number): void;
  moveRight(x: number, y: number): void;
  reset(): void;
  /**
   * Automatically move cursor based on element size and layout direction.
   */
  advanceBySize(element: {width: number, height: number}): void;

  /**
   * Move to the next logical line/row depending on layout direction.
   */
  nextLine(spacing?: number): void;
}