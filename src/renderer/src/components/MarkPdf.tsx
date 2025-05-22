import { useState } from 'react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

function MarkPdf({
  onPdfGenerated
}: {
  onPdfGenerated: (bytesArray: Uint8Array[]) => void
}): React.JSX.Element {
  const [pdfList, setPdfList] = useState<Array<PdfFile>>([])
  const [csvList, setCsvList] = useState<Array<CsvFile>>([])

  const loadPdf = async (): Promise<void> => {
    const result: PdfFile[] | null = await window.electronAPI.openPdfDialog()
    if (result) {
      setPdfList((prevState) => [...prevState, ...result])
    }
  }

  const loadCsv = async (): Promise<void> => {
    const result: CsvFile[] | null = await window.electronAPI.openCsvDialog()
    if (result) {
      setCsvList((prevState) => [...prevState, ...result])
    }
  }

  const modifyPdf = async (): Promise<void> => {
    const merged = [...pdfList, ...csvList].reduce((acc, item) => {
      const existing = acc.get(item.articleCustomer) || {}
      acc.set(item.articleCustomer, { ...existing, ...item })
      return acc
    }, new Map<string, MergedFile>())

    const allPdfBytes: Uint8Array[] = []

    // const result = Array.from(merged.values())
    for (const pdf of merged.values()) {
      if (pdf.content) {
        // Embed the Helvetica font
        const pdfDoc = await PDFDocument.load(pdf.content)
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const pages = pdfDoc.getPages()
        const firstPage = pages[0]

        // Get the width and height of the first page
        const { width, height } = firstPage.getSize()

        // Draw a string of text diagonally across the first page
        firstPage.drawText(`${pdf.order}\n${pdf.articleFrematt}\n${pdf.quantity} stuk(s)`, {
          x: width / 10,
          y: height / 2 + 350,
          size: 20,
          font: helveticaFont,
          color: rgb(0.1, 0.1, 0.95)
        })

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save()
        allPdfBytes.push(pdfBytes)
      }
    }
    onPdfGenerated(allPdfBytes)
  }

  return (
    <>
      <button onClick={loadPdf}>Load Pdf</button>
      <button onClick={loadCsv}>Load Csv</button>
      <button onClick={modifyPdf}>Submit</button>
    </>
  )
}
export default MarkPdf
