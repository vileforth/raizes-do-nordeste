import { readFileSync } from 'fs';
import { join } from 'path';
import * as XLSX from 'xlsx';
import { filterSeedSheetNames, isSeedSheetName, type SeedSheetName } from './sheet-allowlist';

export type SeedWorkbook = Record<SeedSheetName, Record<string, unknown>[]>;

export function resolveWorkbookPath(): string {
  return join(__dirname, '..', '..', '..', '..', 'base de dados - 1 ano - teste.xlsx');
}

export function loadSeedWorkbook(workbookPath = resolveWorkbookPath()): SeedWorkbook {
  const buffer = readFileSync(workbookPath);
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: false });
  const seedSheetNames = filterSeedSheetNames(workbook.SheetNames);
  const sheets = {} as SeedWorkbook;

  for (const sheetName of seedSheetNames) {
    sheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as Record<
      string,
      unknown
    >[];
  }

  return sheets;
}

export function assertSeedSheet<T extends SeedSheetName>(
  sheets: SeedWorkbook,
  sheetName: T,
): Record<string, unknown>[] {
  if (!isSeedSheetName(sheetName)) {
    throw new Error(`Unsupported seed sheet: ${sheetName}`);
  }

  return sheets[sheetName];
}

export function readNumber(row: Record<string, unknown>, key: string): number {
  const value = row[key];

  if (typeof value !== 'number') {
    throw new Error(`Expected numeric value for ${key}`);
  }

  return value;
}

export function readString(row: Record<string, unknown>, key: string): string {
  const value = row[key];

  if (typeof value !== 'string') {
    throw new Error(`Expected string value for ${key}`);
  }

  return value;
}

export function readBoolean(row: Record<string, unknown>, key: string): boolean {
  const value = row[key];

  if (typeof value !== 'boolean') {
    throw new Error(`Expected boolean value for ${key}`);
  }

  return value;
}

export function readOptionalString(row: Record<string, unknown>, key: string): string | null {
  const value = row[key];

  if (value == null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error(`Expected optional string value for ${key}`);
  }

  return value;
}

export function readOptionalNumber(row: Record<string, unknown>, key: string): number | null {
  const value = row[key];

  if (value == null) {
    return null;
  }

  if (typeof value !== 'number') {
    throw new Error(`Expected optional numeric value for ${key}`);
  }

  return value;
}

export function readDecimalString(row: Record<string, unknown>, key: string): string {
  const value = readNumber(row, key);
  return value.toFixed(2);
}
