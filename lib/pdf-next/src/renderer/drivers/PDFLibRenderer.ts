import { rgb, PDFDocument as PDFLibDocument, PDFFont, StandardFonts } from "pdf-lib";
// import type { PDFTextElement } from "../../elements/PDFTextElement";
// import type { PDFDocumentInterface } from "../../types/core/PDFDocument";
// import type { PDFPageInterface } from "../../types/core/PDFPage";
// import type { PDFElementInterface } from "../../types/elements/PDFElement";
// import { PDFRenderer } from "../PDFRenderer";

import type { PDFTextElement } from "../../elements/PDFTextElement";
import type { PDFDocumentInterface } from "../../types/core/PDFDocument";
import type { PDFPageInterface } from "../../types/core/PDFPage";
import type { PDFElementInterface } from "../../types/elements/PDFElement";
import { PDFRenderer } from "../PDFRenderer";


export async function getDefaultFont(doc: PDFLibDocument): Promise<PDFFont> {
  return await doc.embedFont(StandardFonts.Helvetica);
}

export async function measureTextWidth(doc: PDFLibDocument, text: string, fontSize: number, font?: PDFFont): Promise<number> {
  return font ? font.widthOfTextAtSize(text, fontSize) : (await getDefaultFont(doc)).widthOfTextAtSize(text, fontSize);
}

// export async function wrapText(
//   doc: PDFLibDocument,
//   text: string,
//   fontSize: number,
//   maxWidth: number,
//   font?: PDFFont
// ): Promise<string[]> {
//   const usedFont = font ?? await getDefaultFont(doc);

//   const words = text.split(/\s+/);
//   const lines: string[] = [];
//   let currentLine = '';

//   for (const word of words) {
//     const testLine = currentLine ? `${currentLine} ${word}` : word;
//     const testWidth = await measureTextWidth(doc, testLine, fontSize, usedFont);

//     if (testWidth <= maxWidth) {
//       currentLine = testLine;
//     } else {
//       if (currentLine) {
//         lines.push(currentLine);
//       }
//       currentLine = word;
//     }
//   }

//   if (currentLine) {
//     lines.push(currentLine);
//   }

//   return lines;
// }

// export class PDFLibRenderer extends PDFRenderer {
//   private pdfDoc: PDFLibDocument;
//   private currentPage: any;

//   constructor(document: PDFDocumentInterface, engine: any) {
//     super(document);
//     this.pdfDoc = engine;
//   }

//   protected override async beforeRender(): Promise<void> {
//     // You can set metadata here if needed
//     const meta = this.document.metadata;
//     if (meta) {
//       this.pdfDoc.setTitle(meta.title ?? "");
//       this.pdfDoc.setAuthor(meta.author ?? "");
//     }
//   }

//   protected override async afterRender(): Promise<Uint8Array|void> {
//     return await this.pdfDoc.save();
//   }

//   protected override async renderPageStart(page: PDFPageInterface): Promise<void> {
//     const pdfPage = this.pdfDoc.addPage([page.width, page.height]);
//     this.currentPage = pdfPage;
//   }

//   protected override async renderPageEnd(_page: PDFPageInterface): Promise<void> {
//     this.currentPage = null;
//   }

//   protected override async renderElement(element: PDFElementInterface): Promise<void> {
//     if (element.type === "text") {
//       await this.renderTextElement(element as PDFTextElement);
//     }
//     // Handle other element types here (e.g., images, shapes, etc.)
//   }

//   private async renderTextElement(element: PDFTextElement): Promise<void> {
//     if (!this.currentPage || !element.position) return;

//     const {
//       height,
//       width,
//       fontSize,
//       color,
//       backgroundColor,
//       fontFamily,
//       fontWeight,
//       letterSpacing,
//       lineHeight,
//       margin, 
//       padding,
//       textAlign,
//     } = element.style!

//     // const { x, y } = element.position.start;
//     // const fontSize = element.style?.fontSize ?? 12;
//     // const color = element.style?.color ?? "#000000";
//     // const rgbColor = this.hexToRgb(color);

//     // // Todo Should handle text wrapping if element.width exceed the page limit

//     // this.currentPage.drawText(element.text, {
//     //   x,
//     //   y: this.currentPage.getHeight() - y - fontSize,
//     //   size: fontSize,
//     //   color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
//     //   // to do integrate font resolver
//     //   font: element.style?.fontFamily ?? StandardFonts.Helvetica,
//     // });

//     // const {
//     //   text,
//     //   fontSize = 12,
//     //   maxWidth = this.currentPage.getWidth() - cursor.x,
//     //   align = "left",
//     //   direction = "column",
//     //   gap = 4
//     // } = element.style;
//   }

//   private async drawJustifiedLine(
//     doc: PDFLibDocument,
//     line: string,
//     y: number,
//     fontSize: number,
//     maxWidth: number
//   ) {
//     const words = line.trim().split(/\s+/);
    
//     // Hitung lebar tiap kata secara serial agar tidak jadi array Promise
//     const wordWidths: number[] = [];
//     for (const word of words) {
//       const width = await measureTextWidth(doc, word, fontSize);
//       wordWidths.push(width);
//     }

//     // Jumlahkan lebar kata
//     const totalWordWidth = wordWidths.reduce((acc, w) => acc + w, 0);
    
//     // Hitung space ekstra di antara kata jika lebih dari 1 kata
//     const extraSpace = words.length > 1 ? (maxWidth - totalWordWidth) / (words.length - 1) : 0;

//     let x = 0;
//     for (let j = 0; j < words.length; j++) {
//       this.currentPage.drawText(words[j], { x, y, size: fontSize, });
//       x += wordWidths[j] + (j < words.length - 1 ? extraSpace : 0);
//     }
//   }

//   private hexToRgb(hex: string) {
//     const match = hex.replace("#", "").match(/.{1,2}/g);
//     if (!match) return { r: 0, g: 0, b: 0 };
//     const [r, g, b] = match.map((x) => parseInt(x, 16) / 255);
//     return { r, g, b };
//   }

//   public async save(): Promise<Uint8Array> {
//     return await this.afterRender() as unknown as Promise<Uint8Array>;
//   }
// }

export async function wrapText(
  doc: PDFLibDocument,
  text: string,
  fontSize: number,
  availableWidth: number,
  font?: PDFFont
): Promise<string[]> {
  const usedFont = font ?? await getDefaultFont(doc);
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = await measureTextWidth(doc, testLine, fontSize, usedFont);

    if (testWidth <= availableWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }

      // Kalau kata terlalu panjang, coba potong manual
      const wordWidth = await measureTextWidth(doc, word, fontSize, usedFont);
      if (wordWidth > availableWidth) {
        const chars = word.split('');
        let chunk = '';
        for (const char of chars) {
          const nextChunk = chunk + char;
          const nextWidth = await measureTextWidth(doc, nextChunk, fontSize, usedFont);
          if (nextWidth <= availableWidth) {
            chunk = nextChunk;
          } else {
            lines.push(chunk);
            chunk = char;
          }
        }
        if (chunk) lines.push(chunk);
        currentLine = '';
      } else {
        currentLine = word;
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export class PDFLibRenderer extends PDFRenderer {
  private pdfDoc: PDFLibDocument;
  private currentPage: any;
  private font: PDFFont | null = null;

  constructor(document: PDFDocumentInterface, engine: any) {
    super(document);
    this.pdfDoc = engine;
  }

  protected override async beforeRender(): Promise<void> {
    const meta = this.document.metadata;
    if (meta) {
      this.pdfDoc.setTitle(meta.title ?? "");
      this.pdfDoc.setAuthor(meta.author ?? "");
    }
    this.font = await getDefaultFont(this.pdfDoc); // preload default font
  }

  protected override async afterRender(): Promise<Uint8Array | void> {
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
  }

  // private async renderTextElement(element: PDFTextElement): Promise<void> {
  //   if (!this.currentPage || !element.position || !element.style) return;

  //   const {
  //     width = this.currentPage.getWidth(),
  //     fontSize = 12,
  //     color = "#000000",
  //     textAlign = "left",
  //     fontFamily,
  //     lineHeight = fontSize * 1.2,
  //   } = element.style;

  //   const { x, y } = element.position.start;
  //   const text = element.text || "";

  //   // Resolve font: use element fontFamily if provided, else default font
  //   let fontToUse: PDFFont;
  //   if (fontFamily) {
  //     try {
  //       fontToUse = await this.pdfDoc.embedFont(fontFamily);
  //     } catch {
  //       fontToUse = this.font!;
  //     }
  //   } else {
  //     fontToUse = this.font!;
  //   }

  //   // Wrap text to fit max width
  //   const lines = await wrapText(this.pdfDoc, text, fontSize, width, fontToUse);

  //   // Convert color hex to rgb
  //   const rgbColor = this.hexToRgb(color);

  //   // Initial Y position for first line
  //   // PDF coordinate system starts bottom-left, so we invert y
  //   let currentY = this.currentPage.getHeight() - y - fontSize;

  //   for (const line of lines) {
  //     if (textAlign === "justify" && line.trim().includes(" ")) {
  //       await this.drawJustifiedLine(this.pdfDoc, line, currentY, fontSize, width, fontToUse, rgbColor);
  //     } else {
  //       // Calculate x position based on alignment
  //       let lineWidth = fontToUse.widthOfTextAtSize(line, fontSize);
  //       let drawX = x;
  //       if (textAlign === "center") {
  //         drawX = x + (width - lineWidth) / 2;
  //       } else if (textAlign === "right") {
  //         drawX = x + (width - lineWidth);
  //       }

  //       this.currentPage.drawText(line, {
  //         x: drawX + x,
  //         y: currentY,
  //         size: fontSize,
  //         font: fontToUse,
  //         color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
  //       });
  //     }

  //     currentY -= lineHeight;
  //   }
  // }

private async renderTextElement({ text, position, style }: PDFTextElement): Promise<void> {
  if (!this.currentPage || !position) return;
  
  // const {
  //   margin = 0, padding = 0
  // } = style || {};
  
  // Normalisasi padding/margin ke angka serta page width
  // const pad = typeof padding === "number" ? padding : 0;
  // const mar = typeof margin === "number" ? margin : 0;
  // const pageWidth = this.currentPage.getWidth() - mar - pad;

  // console.log(this.currentPage);

  // const {
  //   width = pageWidth,
  //   fontSize = 12,
  //   color = "#000000",
  //   fontFamily,
  //   lineHeight = fontSize * 1.2,
  //   textAlign = "left",
  // } = style || {};

  const { x: rawX, y: rawY } = position.start;


  // Hitung posisi X dan Y sebenarnya
  // const x = rawX + mar + pad;

  function normalizeSpacing(spacing: number | { left?: number, right?: number }) {
    if (typeof spacing === 'number') {
      return { left: spacing, right: spacing };
    }
    return {
      left: spacing?.left ?? 0,
      right: spacing?.right ?? 0
    };
  }

  // const pageWidth = this.currentPage.getWidth();

  // const {
  //   fontSize = 12,
  //   color = "#000000",
  //   fontFamily,
  //   lineHeight = fontSize * 1.2,
  //   textAlign = "left",
  //   padding = 0,
  //   margin = 0,
  //   width
  // } = style || {};

  // const { left: marginLeft, right: marginRight } = normalizeSpacing(margin);
  // const { left: paddingLeft, right: paddingRight } = normalizeSpacing(padding);

  // // ✅ Lebar elemen = width yang ditentukan, atau fallback ke sisa halaman
  // const elementWidth = width ?? (pageWidth - marginLeft - marginRight);

  // // ✅ Area teks = lebar elemen - padding kiri/kanan
  // const contentWidth = elementWidth - paddingLeft - paddingRight;

  // // ✅ Titik x awal tergantung alignment
  // let x = position.start.x + marginLeft + paddingLeft;
  // console.log({x, elementWidth, contentWidth, pageWidth})

  // if (textAlign === "center") {
  //   x = position.start.x + marginLeft + (elementWidth - await measureTextWidth(this.pdfDoc, text, fontSize)) / 2;
  // } else if (textAlign === "right") {
  //   x = position.start.x + marginLeft + (elementWidth - await measureTextWidth(this.pdfDoc, text, fontSize));
  // }

  const pageWidth = this.currentPage.getWidth();

  const {
    fontSize = 12,
    color = "#000000",
    fontFamily,
    lineHeight = fontSize * 1.2,
    textAlign = "left",
    padding = 0,
    margin = 0,
    width
  } = style ?? {};

  const { left: marginLeft, right: marginRight } = normalizeSpacing(margin);
  const { left: paddingLeft, right: paddingRight } = normalizeSpacing(padding);

  const startX = position?.start?.x ?? 0;
  const startY = position?.start?.y ?? 0;

  // 1. Calculate available widths
  // const elementWidth = width ?? (pageWidth - marginLeft - marginRight);
  // const contentWidth = width ?? (
  //   pageWidth
  //   - marginLeft - marginRight
  //   - paddingLeft - paddingRight
  // );
  const availableWidth = width ?? pageWidth - (
    marginLeft + marginRight + paddingLeft + paddingRight
  )

  // 2. Calculate X
  let x = startX + marginLeft + paddingLeft;

  console.log({x, pageWidth, availableWidth, startX})

  const yBase = this.currentPage.getHeight() - rawY - (marginLeft + marginRight) - (paddingLeft + paddingRight);
  // const yBase = this.currentPage.getHeight() - rawY;
  
  const rgbColor = this.hexToRgb(color);
  const usedFont = fontFamily ?? await getDefaultFont(this.pdfDoc);

  // Resolve font: use element fontFamily if provided, else default font
  let fontToUse: PDFFont;
  if (fontFamily) {
    try {
      fontToUse = await this.pdfDoc.embedFont(fontFamily);
    } catch {
      fontToUse = this.font!;
    }
  } else {
    fontToUse = this.font!;
  }

  // Bungkus teks
  const lines = await wrapText(this.pdfDoc, text, fontSize, availableWidth, fontToUse);

  let cursorY = yBase;
  for (const line of lines) {
    switch (textAlign) {
      case "justify":
        await this.drawJustifiedLine(this.pdfDoc, line, x, cursorY, fontSize, availableWidth, fontToUse, rgbColor);
        break;
      case "center":
      case "right":
        const lineWidth = await measureTextWidth(this.pdfDoc, line, fontSize, fontToUse);
        this.currentPage.drawText(line, {
          x: x,
          y: cursorY,
          size: fontSize,
          font: usedFont,
          color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
        });
        break;
      default: // left
        this.currentPage.drawText(line, {
          x,
          y: cursorY,
          size: fontSize,
          font: usedFont,
          color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
        });
        break;
    }

    cursorY -= lineHeight;
  }
}


  private async drawJustifiedLine(
    doc: PDFLibDocument,
    line: string,
    x: number,
    y: number,
    fontSize: number,
    maxWidth: number,
    font: PDFFont,
    color: { r: number; g: number; b: number }
  ) {
    const words = line.trim().split(/\s+/);

    const wordWidths: number[] = [];
    for (const word of words) {
      const width = font.widthOfTextAtSize(word, fontSize);
      wordWidths.push(width);
    }

    const totalWordWidth = wordWidths.reduce((acc, w) => acc + w, 0);
    const extraSpace = words.length > 1 ? (maxWidth - totalWordWidth) / (words.length - 1) : 0;

    for (let j = 0; j < words.length; j++) {
      this.currentPage.drawText(words[j], {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
      });
      x += wordWidths[j] + (j < words.length - 1 ? extraSpace : 0);
    }
  }

  private hexToRgb(hex: string) {
    const match = hex.replace("#", "").match(/.{1,2}/g);
    if (!match) return { r: 0, g: 0, b: 0 };
    const [r, g, b] = match.map((x) => parseInt(x, 16) / 255);
    return { r, g, b };
  }

  public async save(): Promise<Uint8Array> {
    return (await this.afterRender()) as unknown as Promise<Uint8Array>;
  }
}

