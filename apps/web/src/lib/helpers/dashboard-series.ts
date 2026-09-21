export type DailyPoint = {
  date: string;
  value: number;
};

export type OrderReportRow = {
  createdAt: string;
  totalValue?: number | string;
  payment?: { status?: string } | null;
};

function toDateKey(value: string): string {
  return value.slice(0, 10);
}

function emptySeries(days: number, end = new Date()): DailyPoint[] {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (days - 1 - index));
    return { date: date.toISOString().slice(0, 10), value: 0 };
  });
}

export function buildDailySeries(
  rows: OrderReportRow[],
  days: number,
  pick: (row: OrderReportRow) => number,
): DailyPoint[] {
  const series = emptySeries(days);
  const index = new Map(series.map((point, i) => [point.date, i]));
  for (const row of rows) {
    const key = toDateKey(row.createdAt);
    const slot = index.get(key);
    if (slot == null) continue;
    series[slot].value += pick(row);
  }
  return series;
}

export function orderCountValue(): number {
  return 1;
}

export function orderRevenueValue(row: OrderReportRow): number {
  return Number(row.totalValue ?? 0);
}
