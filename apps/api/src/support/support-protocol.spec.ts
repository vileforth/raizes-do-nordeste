import { buildSupportProtocol } from './support-protocol';

describe('buildSupportProtocol', () => {
  it('builds protocol with date and padded sequence', () => {
    const protocol = buildSupportProtocol(7);
    expect(protocol).toMatch(/^ATD-\d{8}-0007$/);
  });
});
