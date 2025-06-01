import { PDFDocument, PDFFont } from 'pdf-lib';
import { resolveFontName } from '../utilities/fons-resolver';

class FontRegistry {
  private static instance: FontRegistry;
  private fontCache = new Map<string, Uint8Array>();

  // Private constructor prevents external instantiation
  private constructor() {}

  // Public method to get the single instance
  public static getInstance(): FontRegistry {
    if (!FontRegistry.instance) {
      FontRegistry.instance = new FontRegistry();
      console.log('FontRegistry instance created');
    }
    return FontRegistry.instance;
  }

  async loadFromUrl(url: string): Promise<Uint8Array> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load font from ${url}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async registerFromUrl(key: string, url: string) {
    const fontBytes = await this.loadFromUrl(url);
    this.fontCache.set(key, fontBytes);
  }

  registerFromBuffer(key: string, buffer: Uint8Array) {
    this.fontCache.set(key, buffer);
  }

  async embed(doc: PDFDocument, key: string): Promise<PDFFont> {
    const fontBytes = this.fontCache.get(key);
    if (!fontBytes) throw new Error(`Font "${key}" not found in registry`);
    return await doc.embedFont(fontBytes);
  }

  list(): string[] {
    return [...this.fontCache.keys()];
  }

  getBytes(key: string): Uint8Array | undefined {
    return this.fontCache.get(key);
  }

  getFont(opts: { family: string; weight: string; italic?: boolean }) {
    const keyName = resolveFontName(opts.family, opts.weight, opts.italic ?? false);
    return this.getBytes(keyName);
  }
}

export const fontsRegistry = FontRegistry.getInstance();