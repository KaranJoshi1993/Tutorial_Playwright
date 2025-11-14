import { parse as csvParse } from 'csv-parse/sync';
import { isFileExists } from './file-utils';
import * as fs from 'fs';

/**
 * Interface for CSV reading options
 */
export interface CSVReadOptions {
  headerRow?: number; // 1-based row number where headers are located (default: 1)
  dataStartRow?: number; // 1-based row number where data starts (default: headerRow + 1)
  excludeFooterLines?: number; // Number of lines to exclude from the end (default: 0)
  delimiter?: string; // CSV delimiter (default: ',')
  skipEmptyLines?: boolean; // Skip empty lines (default: true)
}

/**
 * Reads a CSV file with custom row handling
 * @param filePath Path to the CSV file
 * @param options Options for custom CSV reading
 * @returns Array of objects representing CSV rows
 */
export function readCSVFile(filePath: string, options: CSVReadOptions = {}): any[] {
  try {
    if (!isFileExists(filePath)) {
      throw new Error(`CSV file not found: ${filePath}`);
    }

    const {
      headerRow = 1,
      dataStartRow = headerRow + 1,
      excludeFooterLines = 0,
      delimiter = ',',
      skipEmptyLines = true
    } = options;

    // Read the entire file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const allLines = fileContent.split('\n');
    
    // Calculate effective data range
    const totalLines = allLines.length;
    const headerLineIndex = headerRow - 1; // Convert to 0-based index
    const dataStartLineIndex = dataStartRow - 1; // Convert to 0-based index
    const dataEndLineIndex = excludeFooterLines > 0 ? totalLines - excludeFooterLines : totalLines;

    // Validate indices
    if (headerLineIndex >= totalLines) {
      throw new Error(`Header row ${headerRow} exceeds total lines ${totalLines}`);
    }
    if (dataStartLineIndex >= dataEndLineIndex) {
      throw new Error(`Data start row ${dataStartRow} is invalid or overlaps with footer exclusion`);
    }

    // Extract header line
    const headerLine = allLines[headerLineIndex];
    if (!headerLine || headerLine.trim() === '') {
      throw new Error(`Header row ${headerRow} is empty`);
    }

    // Parse header to get column names
    const headers = csvParse(headerLine, {
      delimiter,
      skip_empty_lines: skipEmptyLines,
      relax_quotes: true,
      relax_column_count: true
    })[0];

    // Extract data lines
    const dataLines = allLines.slice(dataStartLineIndex, dataEndLineIndex);
    
    // Filter out empty lines if requested
    const filteredDataLines = skipEmptyLines 
      ? dataLines.filter(line => line && line.trim() !== '')
      : dataLines;

    // Parse data lines
    const results: any[] = [];
    
    for (let i = 0; i < filteredDataLines.length; i++) {
      const line = filteredDataLines[i];
      
      // Skip lines that are clearly total/summary lines (contain 'Total:', 'Gtotal:', etc.)
      if (line.includes('Total:') || line.includes('Gtotal:') || line.includes('Grand Total:')) {
        continue;
      }
      
      try {
        const parsedRow = csvParse(line, {
          delimiter,
          skip_empty_lines: true,
          relax_quotes: true,
          relax_column_count: true
        })[0];
        
        if (parsedRow && parsedRow.length > 0) {
          // Create object mapping headers to values
          const rowObject: any = {};
          headers.forEach((header: string, index: number) => {
            const value = parsedRow[index] || '';
            rowObject[header.trim()] = typeof value === 'string' ? value.trim() : value;
          });
          
          // Only add rows that have meaningful data (not all empty values)
          const hasData = Object.values(rowObject).some(value => 
            value !== null && value !== undefined && value !== ''
          );
          
          if (hasData) {
            results.push(rowObject);
          }
        }
      } catch (parseError) {
        console.warn(`Failed to parse line ${dataStartRow + i}: ${line}`, parseError);
        // Continue with next line instead of failing completely
      }
    }

    return results;
    
  } catch (error) {
    console.error(`Error reading CSV file: ${filePath}`, error);
    throw error;
  }
}