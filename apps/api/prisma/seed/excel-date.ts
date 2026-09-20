const EXCEL_EPOCH_OFFSET = 25569;
const MILLISECONDS_PER_DAY = 86400000;

export function excelSerialToDate(serial: number): Date {
  if (!Number.isFinite(serial)) {
    throw new Error('Excel serial date must be a finite number');
  }

  const wholeDays = Math.floor(serial);
  const dayFraction = serial - wholeDays;
  const milliseconds =
    (wholeDays - EXCEL_EPOCH_OFFSET) * MILLISECONDS_PER_DAY +
    Math.round(dayFraction * MILLISECONDS_PER_DAY);

  return new Date(milliseconds);
}

export function excelSerialToDateOrNull(serial: number | null | undefined): Date | null {
  if (serial == null) {
    return null;
  }

  return excelSerialToDate(serial);
}
