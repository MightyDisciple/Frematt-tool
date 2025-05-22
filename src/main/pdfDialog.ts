import { dialog, ipcMain } from 'electron'
import fs from 'fs'
import path from 'node:path'

function pdfDialog(): void {
  ipcMain.handle('open-pdf-dialog', async (): Promise<PdfFile[] | null> => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'PDF files', extensions: ['pdf'] }]
    })

    if (result.canceled) return []
    return result.filePaths.map((filePath) => ({
      filePath: path.basename(filePath),
      articleCustomer: path.basename(filePath).split(' ')[0],
      content: fs.readFileSync(filePath)
    }))
  })
}
export default pdfDialog
