import type { PDFDocumentLifecycleEvents } from "./events/PDFDocumentEvents";
import type { PDFElementLifecycleEvents } from "./events/PDFElementEvents";
import type { PDFPageLifecycleEvents } from "./events/PDFPageEvents";
import { PDFLifecycleManager } from "./PDFLifecycleManager";
export interface EventHooks {
  Document: PDFLifecycleManager<PDFDocumentLifecycleEvents>,
  Page: PDFLifecycleManager<PDFPageLifecycleEvents>,
  Element: PDFLifecycleManager<PDFElementLifecycleEvents>,
}
export class PDFLifecycleRegistry {
  static Hooks: EventHooks;
  static {
    this.Hooks = {
      Document: new PDFLifecycleManager<PDFDocumentLifecycleEvents>(),
      Page: new PDFLifecycleManager<PDFPageLifecycleEvents>(),
      Element: new PDFLifecycleManager<PDFElementLifecycleEvents>(),
    }
  }
}