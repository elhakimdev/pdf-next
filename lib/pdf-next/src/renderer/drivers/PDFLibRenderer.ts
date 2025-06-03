import { rgb, PDFDocument as PDFLibDocument, PDFFont, StandardFonts } from "pdf-lib";
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
//   availableWidth: number,
//   rightOffset: number,
//   textAlign: "left" | "right" | "center" | "justify",
//   font?: PDFFont
// ): Promise<string[]> {
//   const usedFont = font ?? await getDefaultFont(doc);
//   const words = text.trim().split(/\s+/);
//   const lines: string[] = [];
//   let currentLine = '';

//   let offsetEndOfX = 0;

//   if(textAlign === "left") {
//     offsetEndOfX = rightOffset;
//   } else if(textAlign === "right") {
//     offsetEndOfX = 0;
//   } else if(textAlign === "center") {
//     offsetEndOfX = 0
//   } else {
//     offsetEndOfX = rightOffset
//   }

//   for (const word of words) {
//     const testLine = currentLine ? `${currentLine} ${word}` : word;
//     const testWidth = await measureTextWidth(doc, testLine, fontSize, usedFont);

//     if (testWidth + offsetEndOfX <= availableWidth) {
//       currentLine = testLine;
//     } else {
//       if (currentLine) {
//         lines.push(currentLine);
//       }

//       // Kalau kata terlalu panjang, coba potong manual
//       const wordWidth = await measureTextWidth(doc, word, fontSize, usedFont);
//       if (wordWidth > availableWidth) {
//         const chars = word.split('');
//         let chunk = '';
//         for (const char of chars) {
//           const nextChunk = chunk + char;
//           const nextWidth = await measureTextWidth(doc, nextChunk, fontSize, usedFont);
//           if (nextWidth + offsetEndOfX <= availableWidth) {
//             chunk = nextChunk;
//           } else {
//             lines.push(chunk);
//             chunk = char;
//           }
//         }
//         if (chunk) lines.push(chunk);
//         currentLine = '';
//       } else {
//         currentLine = word;
//       }
//     }
//   }

//   if (currentLine) {
//     lines.push(currentLine);
//   }

//   return lines;
// }
export async function wrapText(
  doc: PDFLibDocument,
  text: string,
  fontSize: number,
  availableWidth: number,
  rightOffset: number, // Represents the right margin/padding
  textAlign: "left" | "right" | "center" | "justify", // Keep for rendering, but not for wrapping width calculation
  font?: PDFFont
): Promise<string[]> {
  const usedFont = font ?? await getDefaultFont(doc);
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  // Calculate the actual usable width for text lines, accounting for the right margin/offset.
  // This width is used for wrapping regardless of text alignment.
  const effectiveWidth = availableWidth - rightOffset;

  // Ensure effectiveWidth is not negative if rightOffset is larger than availableWidth
  if (effectiveWidth <= 0) {
    console.warn("Effective width for text wrapping is zero or negative. Check availableWidth and rightOffset.");
    // Depending on desired behavior, you might return early or handle this case differently.
    // For now, we'll proceed, but wrapping might behave unexpectedly.
    // Returning a single line with the original text might be an option:
    return [text.trim()];
  }

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = await measureTextWidth(doc, testLine, fontSize, usedFont);

    // Check if the line fits within the calculated effective width
    if (testWidth <= effectiveWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }

      // Handle words longer than the effective width
      const wordWidth = await measureTextWidth(doc, word, fontSize, usedFont);
      if (wordWidth > effectiveWidth) {
        // Word is too long, attempt to break it character by character
        const chars = word.split('');
        let chunk = '';
        for (const char of chars) {
          const nextChunk = chunk + char;
          const nextWidth = await measureTextWidth(doc, nextChunk, fontSize, usedFont);
          // Check character chunk against effective width
          if (nextWidth <= effectiveWidth) {
            chunk = nextChunk;
          } else {
            // Only push non-empty chunks
            if (chunk) lines.push(chunk);
            // Start new chunk with the current character
            chunk = char;
            // Check if even a single character exceeds the width (edge case)
            const charWidth = await measureTextWidth(doc, char, fontSize, usedFont);
            if (charWidth > effectiveWidth) {
                 console.warn(`Character '${char}' is wider than the effective width.`);
                 // Decide how to handle this: push it anyway? skip it?
                 // Pushing it might still cause overflow depending on rendering.
                 lines.push(char); // Push the single character line
                 chunk = ''; // Reset chunk as this character formed its own line
            }
          }
        }
        // Push any remaining part of the chunk
        if (chunk) lines.push(chunk);
        currentLine = ''; // Reset currentLine as the long word was fully processed
      } else {
        // Word is not longer than the line, so it starts the next line
        currentLine = word;
      }
    }
  }

  // Add the last line if it exists
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

  private async renderTextElement(element: PDFTextElement): Promise<void> {
    if (!this.currentPage || !element.position || !element.style) return;

    const {
      width = this.currentPage.getWidth(),
      fontSize = 12,
      color = "#000000",
      textAlign = "left",
      fontFamily,
      lineHeight = fontSize * 1.2,
    } = element.style;

    const { x, y } = element.position.start;
    const text = element.text || "";

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

    // Hitung availableWidth berdasarkan width element dikurangi posisi x
    const pageWidth = this.currentPage.getWidth();
    let availableWidth = width ? Math.min(width, pageWidth - x) : pageWidth - x;
    const lines = await wrapText(this.pdfDoc, text, fontSize, availableWidth, x, textAlign, fontToUse);

    const rgbColor = this.hexToRgb(color);

    // Draw text per line
    lines.forEach((line, i) => {
      let offsetX = x;
      const textWidth = fontToUse.widthOfTextAtSize(line, fontSize);

      if (textAlign === "center") {
        availableWidth = width ? Math.min(width, pageWidth - 2*x) : pageWidth - 2*x;
        offsetX = x + (availableWidth - textWidth) / 2;
      } else if (textAlign === "right") {
        offsetX = (availableWidth - textWidth);
      }

      this.currentPage.drawText(line, {
        x: offsetX,
        y: this.currentPage.getHeight() - y - i * lineHeight - fontSize,
        size: fontSize,
        font: fontToUse,
        color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
      });
    });
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

