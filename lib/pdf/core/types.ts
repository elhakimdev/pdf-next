export type Cursor = {
  x: number,
  y: number
}

export type PdfConfig = {
  page?: {
    orientation?: "portrait" | "landscape",
    margin?: number
  }
}
export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}