// src/renderer/src/preload.d.ts
export {}

declare global {
  type PdfFile = {
    content: Uint8Array
    articleCustomer: string
    filePath: string
  }
  type CsvFile = {
    articleFrematt: string
    articleCustomer: string
    order: string
    quantity: string
  }
  type MergedFile = Partial<PdfFile> & Partial<CsvFile>

  interface Window {
    electronAPI: {
      openPdfDialog: () => Promise<PdfFile[] | null>
      openCsvDialog: () => Promise<CsvFile[] | null>
    }
  }
}
