export interface PDFElementLifecycleEvents {
  beforeDraw: { elementId: string };
  afterDraw: { elementId: string };
}