import type { PDFCursorManagerInterface, TextDirection, FlexDirection } from "../types/core/PDFCursorManager";

export class PDFCursorManager implements PDFCursorManagerInterface {
  x = 0;
  y = 0;
  lineHeight = 0;

  constructor(
    private readonly marginTop = 0,
    private readonly marginLeft = 0,
    public direction: TextDirection = "LTR",
    public flexDirection: FlexDirection = "vertical"
  ) {
    this.reset();
  }

  moveTo(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  moveUp(x: number, y: number): void {
    this.x -= x;
    this.y -= y;
  }

  moveDown(x: number, y: number): void {
    this.x += x;
    this.y += y;
  }

  moveLeft(x: number): void {
    this.x -= x;
  }

  moveRight(x: number): void {
    this.x += x;
  }

  reset(): void {
    this.x = this.marginLeft;
    this.y = this.marginTop;
    this.lineHeight = 0;
  }

  advanceBySize(element: {width: number, height: number}): void {
    if (this.flexDirection === "vertical") {
      this.y += element.height;
      this.lineHeight = Math.max(this.lineHeight, element.height);
    } else {
      const horizontalDelta = element.width;
      this.x += this.direction === "LTR" ? horizontalDelta : -horizontalDelta;
      this.lineHeight = Math.max(this.lineHeight, element.height);
    }
  }

  nextLine(spacing: number = 0): void {
    if (this.flexDirection === "vertical") {
      this.y += this.lineHeight + spacing;
      this.x = this.marginLeft;
    } else {
      this.x = this.direction === "LTR" ? this.marginLeft : -this.marginLeft;
      this.y += this.lineHeight + spacing;
    }
    this.lineHeight = 0;
  }

  getAbsolutePosition(pageIndex: number, pageHeights: number[]): { x: number; y: number } {
    const offsetY = pageHeights.slice(0, pageIndex).reduce((acc, h) => acc + h, 0);
    return {
      x: this.x,
      y: offsetY + this.y
    };
  }
}
