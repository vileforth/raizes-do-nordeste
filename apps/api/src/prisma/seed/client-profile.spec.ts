import { createClientProfile, resolveAreaCode } from '../../../prisma/seed/client-profile';
import { createSeedFaker } from '../../../prisma/seed/helpers';

describe('client profile seed', () => {
  it('builds a Recife address from area code 81', () => {
    const profile = createClientProfile(createSeedFaker(), '81');

    expect(profile.city).toBe('Recife');
    expect(profile.state).toBe('PE');
    expect(profile.preferredUnitId).toBe(1);
    expect(profile.zipCode).toHaveLength(8);
    expect(profile.address).toContain(' - ');
  });

  it('reads the area code from a phone number', () => {
    expect(resolveAreaCode('85931967797')).toBe('85');
  });
});
