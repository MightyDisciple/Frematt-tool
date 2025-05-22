// src/renderer/src/preload.d.ts
export {}

declare global {
  type PdfFile = {
    content: Uint8Array
    articleCustomer: string
    filePath: string
  }
  type OrderData = {
    articleFrematt: string
    articleCustomer: string
    order: string
    quantity: string
  }
  type MergedFile = Partial<PdfFile> & Partial<OrderData>

  interface Window {
    electronAPI: {
      openPdfDialog: () => Promise<PdfFile[] | null>
      openCsvDialog: () => Promise<OrderData[] | null>
    }
  }
}
