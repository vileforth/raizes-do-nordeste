export const DEFAULT_BATCH_SIZE = 1000;

export async function createManyInBatches<T>(
  items: T[],
  createBatch: (batch: T[]) => Promise<{ count: number }>,
  batchSize = DEFAULT_BATCH_SIZE,
): Promise<number> {
  let total = 0;

  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize);
    const result = await createBatch(batch);
    total += result.count;
  }

  return total;
}
