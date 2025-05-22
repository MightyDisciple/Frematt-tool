import { dialog, ipcMain } from 'electron'
import fs from 'fs'
import * as XLSX from 'xlsx'

function csvDialog(): void {
  ipcMain.handle('open-csv-dialog', async (): Promise<CsvFile[] | null> => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'XLSX file', extensions: ['xlsx'] }]
    })

    if (result.canceled) return null

    const filePath = result.filePaths[0]
    const extension = filePath.split('.').pop()?.toLowerCase()

    if (extension === 'xlsx') {
      const fileBuffer = fs.readFileSync(filePath)
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
      const firstSheetName = workbook.SheetNames[0]
      const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheetName], { FS: ';' })

      const lines = csv.split('\n').slice(1) // skip header
      return lines
        .map((line) => line.trim())
        .filter((line) => line.length > 0) // ignore empty lines
        .map((line) => {
          const [order, articleFrematt, quantity, articleCustomer] = line.split(';')
          return {
            order,
            articleFrematt,
            quantity,
            articleCustomer: articleCustomer?.split(' ')[0] ?? ''
          }
        })
    }

    return null
  })
}
export default csvDialog
