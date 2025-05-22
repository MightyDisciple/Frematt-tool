import { createFileRoute } from '@tanstack/react-router'
import { JSX, useState } from 'react'
import MarkPdf from '@renderer/components/MarkPdf'
import PdfViewer from '@renderer/components/PdfViewer'

export const Route = createFileRoute('/pdf')({
  component: RouteComponent
})

function RouteComponent(): JSX.Element {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array[] | undefined>(undefined)

  return (
    <div>
      <MarkPdf onPdfGenerated={(bytesArray: Uint8Array[]) => setPdfBytes(bytesArray)} />
      <div className="h-screen">
        <PdfViewer pdfBytes={pdfBytes} />
      </div>
    </div>
  )
}
