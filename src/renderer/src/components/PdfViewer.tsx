import React, { useState, useEffect } from 'react'
import { PDFDocument } from 'pdf-lib'

function PdfViewer({ pdfBytes }: { pdfBytes: Uint8Array[] | undefined }): React.JSX.Element {
  const [pdfUrl, setPdfUrl] = useState<string>('')

  useEffect(() => {
    async function mergeAndDisplay(): Promise<(() => void) | undefined> {
      if (!pdfBytes || pdfBytes.length === 0) {
        setPdfUrl('')
        return
      }

      const mergedPdf = await PDFDocument.create()

      for (const bytes of pdfBytes) {
        const pdf = await PDFDocument.load(bytes)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const mergedPdfBytes = await mergedPdf.save()
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      setPdfUrl(url)

      return () => URL.revokeObjectURL(url)
    }

    mergeAndDisplay()
  }, [pdfBytes])

  if (!pdfUrl) {
    return <div>No PDF to display</div>
  }

  return (
    <iframe
      src={pdfUrl}
      width="100%"
      height="600"
      title="Merged PDF Viewer"
      style={{ border: 'none' }}
    />
  )
}

export default PdfViewer
