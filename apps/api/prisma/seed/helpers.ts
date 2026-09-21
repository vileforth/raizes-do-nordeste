import { faker } from '@faker-js/faker/locale/pt_BR';
import { FAKER_SEED } from './counts';
import { buildCpf } from './cpf';

export type SeedFaker = typeof faker;

export function createSeedFaker(): SeedFaker {
  faker.seed(FAKER_SEED);
  return faker;
}

export function createCpf(instance: SeedFaker): string {
  const digits = Array.from({ length: 9 }, () => instance.number.int({ min: 0, max: 9 }));
  return buildCpf(digits);
}

export function createPhone(instance: SeedFaker, areaCode: string): string {
  return `${areaCode}9${instance.string.numeric(8)}`;
}

export function slugifyName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '');
}

export function padCode(prefix: string, value: number, size = 6): string {
  return `${prefix}${String(value).padStart(size, '0')}`;
}

export function pick<T>(instance: SeedFaker, items: readonly T[]): T {
  return items[instance.number.int({ min: 0, max: items.length - 1 })];
}

export function money(value: number): string {
  return value.toFixed(2);
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}
