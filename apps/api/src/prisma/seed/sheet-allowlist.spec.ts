import * as XLSX from 'xlsx';
import {
  SEED_SHEET_NAMES,
  SKIPPED_SHEET_NAMES,
  filterSeedSheetNames,
  isSeedSheetName,
  isSkippedSheetName,
} from '../../../prisma/seed/sheet-allowlist';

describe('sheet allowlist', () => {
  it('includes all 25 seedable workbook sheets', () => {
    expect(SEED_SHEET_NAMES).toHaveLength(25);
  });

  it('skips Resumo and LEIA-ME sheets', () => {
    expect(SKIPPED_SHEET_NAMES).toEqual(['Resumo', 'LEIA-ME']);
    expect(isSkippedSheetName('Resumo')).toBe(true);
    expect(isSkippedSheetName('LEIA-ME')).toBe(true);
    expect(isSkippedSheetName('USUARIO')).toBe(false);
  });

  it('filters workbook sheet names to the seed allowlist', () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([['a']]), 'Resumo');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([['b']]), 'USUARIO');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([['c']]), 'LEIA-ME');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([['d']]), 'PEDIDO');

    const filtered = filterSeedSheetNames(workbook.SheetNames);

    expect(filtered).toEqual(['USUARIO', 'PEDIDO']);
    expect(isSeedSheetName('USUARIO')).toBe(true);
    expect(isSeedSheetName('Resumo')).toBe(false);
  });
});
