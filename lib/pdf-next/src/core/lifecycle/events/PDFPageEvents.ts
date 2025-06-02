export interface PDFPageLifecycleEvents {
  beforeRender: { pageIndex: number };
  afterRender: { pageIndex: number };
  beforeElementAdd: { elementId: string };
  afterElementAdd: { elementId: string };
}