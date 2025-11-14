import ExcelJS from "exceljs";

export async function readExcelFile(filePath: string): Promise<any[][]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.getWorksheet(1);
    const data: any[][] = [];
    
    worksheet?.eachRow((row, rowNumber) => {
        const rowData: any[] = [];
        // Get the actual column count to handle empty cells properly
        const actualColumnCount = worksheet.actualColumnCount || row.actualCellCount;
        
        for (let colIndex = 1; colIndex <= actualColumnCount; colIndex++) {
            const cell = row.getCell(colIndex);
            rowData.push(cell.value !== undefined ? cell.value : null);
        }
        data.push(rowData);
    });
    
    return data;
}

export async function readExcelWorksheet(filePath: string, worksheetName: string): Promise<any[][]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.getWorksheet(worksheetName);
    const data: any[][] = [];
    
    worksheet?.eachRow((row, rowNumber) => {
        const rowData: any[] = [];
        // Get the actual column count to handle empty cells properly
        const actualColumnCount = worksheet.actualColumnCount || row.actualCellCount;
        
        for (let colIndex = 1; colIndex <= actualColumnCount; colIndex++) {
            const cell = row.getCell(colIndex);
            rowData.push(cell.value !== undefined ? cell.value : null);
        }
        data.push(rowData);
    });
    
    return data;
}

export async function readExcelAsObjects(filePath: string, hasHeaders: boolean = true): Promise<Record<string, any>[]> {
    const data = await readExcelFile(filePath);
    
    if (data.length === 0) return [];
    
    if (!hasHeaders) {
        return data.map((row, index) => ({ rowIndex: index, ...row }));
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => {
        const obj: Record<string, any> = {};
        headers.forEach((header, index) => {
            obj[String(header)] = row[index];
        });
        return obj;
    });
}

export async function readExcelRowsFromIndex(
    filePath: string, 
    startRowIndex: number, 
    headerRowIndex: number = 0
): Promise<Record<string, any>[]> {
    const data = await readExcelFile(filePath);
    
    if (data.length === 0 || startRowIndex >= data.length || headerRowIndex >= data.length) {
        return [];
    }
    
    const headers = data[headerRowIndex];
    const rows = data.slice(startRowIndex);
    
    return rows.map(row => {
        const obj: Record<string, any> = {};
        headers.forEach((header, index) => {
            obj[String(header)] = row[index] !== undefined ? row[index] : null;
        });
        return obj;
    });
}