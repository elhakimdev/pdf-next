import { PDFFont, PDFPage, rgb, StandardFonts, type PDFDocument } from "pdf-lib";
import { PdfElement } from "./base";
import type { Cursor } from "../core/types";

type TextAlign = 'left' | 'center' | 'right' | 'justify';

export class TextBlock extends PdfElement {
  protected textLines: string[] = [];
  constructor(
    private text: string,
    private options: {
      size?: number;
      color?: { r: number; g: number; b: number };
      fonts?: PDFFont | Uint8Array;
      weight?: any;
      x?: number;
      y?: number;
      position?: 'relative' | 'absolute';
      lineHeights?: number;
      wrap?: boolean;
      align?: TextAlign;     // <- New alignment option
    } = {},
  ) {
    super();
  }

  private wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const width = font.widthOfTextAtSize(testLine, size);
      if (width > maxWidth) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  async write(doc: PDFDocument, page: PDFPage, cursor: Cursor): Promise<void> {
    const font = await doc.embedFont(this.options.fonts as Uint8Array ?? StandardFonts.Helvetica);
    const size = this.options.size ?? 12;
    const positionMode = this.options.position ?? 'relative';
    const lineHeight = (this.options.lineHeights ?? 1.2) * size;
    const wrap = this.options.wrap ?? false;
    const maxWidth = (page.getWidth() - cursor.x - 40); // fallback margin
    const align: TextAlign = this.options.align ?? 'left';

    let baseX = 0;
    let y = 0;

    if (positionMode === 'absolute') {
      baseX = this.options.x ?? cursor.x;
      y = this.options.y ?? cursor.y;
    } else {
      baseX = cursor.x + (this.options.x ?? 0);
      y = cursor.y - (this.options.y ?? 0);
    }

    this.textLines = (wrap ? this.wrapText(this.text, font, size, maxWidth) : [this.text]) as string[];

    for (const line of this.textLines) {
      const lineWidth = font.widthOfTextAtSize(line, size);
      let x = baseX;

      if (align === 'center') {
        x += (maxWidth - lineWidth) / 2;
      } else if (align === 'right') {
        x += (maxWidth - lineWidth);
      }

      page.drawText(line, {
        x,
        y,
        size,
        font,
        color: this.options.color
          ? rgb(this.options.color.r, this.options.color.g, this.options.color.b)
          : undefined,
      });

      // console.log({y, line, x, maxWidth, page});

      y -= lineHeight;
    }

    if (positionMode === 'relative') {
      cursor.y = y;
    }
  }

  override getHeight(): number {
    // Calculate height
    const size = this.options.size ?? 12;
    const lineHeight = (this.options.lineHeights ?? 1.2) * size;
    const height = this.textLines.length * size * lineHeight;
    return height;
  }
}
