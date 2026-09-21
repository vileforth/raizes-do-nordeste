export interface AuditEntityRef {
  entity: string;
  entityId: number;
}

export function parseAuditEntity(
  path: string,
  result: unknown,
): AuditEntityRef {
  const segments = path.split('?')[0].split('/').filter(Boolean);
  const resource = segments[0] ?? 'unknown';
  const entity = resource.charAt(0).toUpperCase() + resource.slice(1);

  const numericSegment = segments.find((segment) => /^\d+$/.test(segment));
  if (numericSegment) {
    return { entity, entityId: Number(numericSegment) };
  }

  const resultId = extractIdFromResult(result);
  return { entity, entityId: resultId ?? 0 };
}

function extractIdFromResult(result: unknown): number | undefined {
  if (!result || typeof result !== 'object') {
    return undefined;
  }
  const record = result as Record<string, unknown>;
  if (typeof record.id === 'number') {
    return record.id;
  }
  return undefined;
}
