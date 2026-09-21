import { excelSerialToDate } from '../../../prisma/seed/excel-date';

describe('excelSerialToDate', () => {
  it('converts whole-day Excel serials to UTC dates', () => {
    const result = excelSerialToDate(45933);

    expect(result.toISOString()).toBe('2025-10-03T00:00:00.000Z');
  });

  it('preserves fractional day time from Excel serials', () => {
    const result = excelSerialToDate(45933.95832175926);

    expect(result.toISOString()).toBe('2025-10-03T22:59:59.000Z');
  });

  it('throws for non-finite serial values', () => {
    expect(() => excelSerialToDate(Number.NaN)).toThrow('Excel serial date must be a finite number');
  });
});
