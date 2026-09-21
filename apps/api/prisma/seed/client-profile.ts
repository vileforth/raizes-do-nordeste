import { CLIENT_LOCATIONS } from './data/client-locations';
import { pick, type SeedFaker } from './helpers';

export type ClientProfileFields = {
  birthDate: Date;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  preferredUnitId: number;
  latitude: number;
  longitude: number;
};

export function resolveAreaCode(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.slice(0, 2);
}

export function createClientProfile(
  instance: SeedFaker,
  areaCode: string,
): ClientProfileFields {
  const location = CLIENT_LOCATIONS[areaCode] ?? CLIENT_LOCATIONS['81'];
  const street = pick(instance, location.streets);
  const neighborhood = pick(instance, location.neighborhoods);
  const number = instance.number.int({ min: 20, max: 2400 });
  const jitter = () => instance.number.float({ min: -0.12, max: 0.12, multipleOf: 0.0001 });
  return {
    birthDate: instance.date.birthdate({ min: 18, max: 72, mode: 'age' }),
    address: `${street}, ${number} - ${neighborhood}`,
    city: location.city,
    state: location.state,
    zipCode: instance.string.numeric(8),
    preferredUnitId: location.preferredUnitId,
    latitude: location.latitude + jitter(),
    longitude: location.longitude + jitter(),
  };
}
