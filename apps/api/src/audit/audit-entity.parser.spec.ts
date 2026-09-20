import { parseAuditEntity } from './audit-entity.parser';

describe('parseAuditEntity', () => {
  it('extracts entity and id from path', () => {
    const result = parseAuditEntity('/promotions/12/units', null);
    expect(result).toEqual({ entity: 'Promotions', entityId: 12 });
  });

  it('falls back to result id', () => {
    const result = parseAuditEntity('/coupons/validate', { id: 44 });
    expect(result).toEqual({ entity: 'Coupons', entityId: 44 });
  });
});
