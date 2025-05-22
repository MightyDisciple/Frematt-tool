import { dialog, ipcMain } from 'electron'
import fs from 'fs'
import * as XLSX from 'xlsx'

function csvDialog(): void {
  ipcMain.handle('open-csv-dialog', async (): Promise<OrderData[] | null | string> => {
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
      const orderDataList: OrderData[] = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName])
      const expectedKeys = ['Bestel ID', 'Artikel', 'Fact. aant.', 'Omschrijving']

      const csvKeys = Object.keys(orderDataList[0])
      const hasExactKeys =
        csvKeys.length === expectedKeys.length && expectedKeys.every((key) => csvKeys.includes(key))

      if (hasExactKeys) {
        return orderDataList.map((orderData) => {
          return {
            order: orderData['Bestel ID'],
            articleFrematt: orderData['Artikel'],
            quantity: orderData['Fact. aant.'],
            articleCustomer: orderData['Omschrijving'].split(' ')[0]
          }
        })
      } else {
        return 'Wrong keys'
      }
    }

    return null
  })
}
export default csvDialog
