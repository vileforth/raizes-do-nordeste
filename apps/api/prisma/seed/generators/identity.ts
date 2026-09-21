import { Prisma, UserStatus } from '@prisma/client';
import { ADMIN_EMAIL, ADMIN_NAME, SEED_COUNTS } from '../counts';
import { SEED_UNITS } from '../data/units';
import { createCpf, createPhone, createSeedFaker, slugifyName } from '../helpers';

const PASSWORD_HASH = 'supabase_managed';

const EMPLOYEE_ROLES = [
  ...Array.from({ length: 6 }, () => 'GERENTE' as const),
  ...Array.from({ length: 2 }, () => 'ADMINISTRADOR' as const),
  ...Array.from({ length: 26 }, () => 'ATENDENTE' as const),
  ...Array.from({ length: 26 }, () => 'COZINHEIRO' as const),
];

const CLIENT_AREA_CODES = ['81', '71', '85', '84', '83', '82', '86', '98'];

export function buildProfiles(): Prisma.ProfileCreateManyInput[] {
  return [
    { id: 1, name: 'CLIENTE', description: 'Acesso às funcionalidades do cliente', active: true },
    { id: 2, name: 'ATENDENTE', description: 'Operação de atendimento e balcão', active: true },
    { id: 3, name: 'COZINHEIRO', description: 'Operação de preparação de pedidos', active: true },
    { id: 4, name: 'GERENTE', description: 'Gestão operacional da unidade', active: true },
    { id: 5, name: 'ADMINISTRADOR', description: 'Gestão da rede', active: true },
  ];
}

export function buildUnits(): Prisma.UnitCreateManyInput[] {
  return SEED_UNITS.map((unit) => ({
    id: unit.id,
    name: unit.name,
    address: unit.address,
    phone: unit.phone,
    status: unit.status,
    registeredAt: unit.registeredAt,
    latitude: unit.latitude,
    longitude: unit.longitude,
  }));
}

export function buildIdentity() {
  const faker = createSeedFaker();
  const users: Prisma.UserCreateManyInput[] = [];
  const clients: Prisma.ClientCreateManyInput[] = [];
  const employees: Prisma.EmployeeCreateManyInput[] = [];
  const userProfiles: Prisma.UserProfileCreateManyInput[] = [];
  const usedEmails = new Set<string>();
  const usedCpfs = new Set<string>();

  for (let id = 1; id <= SEED_COUNTS.clients; id += 1) {
    const name = faker.person.fullName();
    let email = `${slugifyName(name)}.${id}@email.com`;
    while (usedEmails.has(email)) {
      email = `${slugifyName(name)}.${id}.${faker.string.numeric(2)}@email.com`;
    }
    usedEmails.add(email);
    let cpf = createCpf(faker);
    while (usedCpfs.has(cpf)) {
      cpf = createCpf(faker);
    }
    usedCpfs.add(cpf);
    const areaCode = CLIENT_AREA_CODES[id % CLIENT_AREA_CODES.length];
    users.push({
      id,
      name,
      email,
      passwordHash: PASSWORD_HASH,
      phone: createPhone(faker, areaCode),
      status: id % 37 === 0 ? UserStatus.INATIVO : UserStatus.ATIVO,
      registeredAt: faker.date.between({ from: '2025-03-01', to: '2026-08-30' }),
    });
    clients.push({
      id,
      userId: id,
      cpf,
      registeredAt: users[id - 1].registeredAt as Date,
      active: users[id - 1].status === UserStatus.ATIVO,
    });
    userProfiles.push({ userId: id, profileId: 1 });
  }

  for (let index = 0; index < SEED_COUNTS.employees; index += 1) {
    const id = SEED_COUNTS.clients + index + 1;
    const role = EMPLOYEE_ROLES[index];
    const unit = SEED_UNITS[index % SEED_UNITS.length];
    const name = faker.person.fullName();
    let email = `${slugifyName(name)}.${id}@raizes.com`;
    while (usedEmails.has(email)) {
      email = `${slugifyName(name)}.${id}.${faker.string.numeric(2)}@raizes.com`;
    }
    usedEmails.add(email);
    users.push({
      id,
      name,
      email,
      passwordHash: PASSWORD_HASH,
      phone: createPhone(faker, unit.areaCode),
      status: UserStatus.ATIVO,
      registeredAt: faker.date.between({ from: '2025-03-01', to: '2026-06-01' }),
    });
    employees.push({
      id,
      userId: id,
      unitId: unit.id,
      registrationNumber: `RN${String(id).padStart(4, '0')}`,
      role,
      active: true,
    });
    const profileId =
      role === 'ATENDENTE' ? 2 : role === 'COZINHEIRO' ? 3 : role === 'GERENTE' ? 4 : 5;
    userProfiles.push({ userId: id, profileId });
  }

  const adminId = SEED_COUNTS.clients + SEED_COUNTS.employees + 1;
  users.push({
    id: adminId,
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    passwordHash: PASSWORD_HASH,
    phone: '81998887766',
    status: UserStatus.ATIVO,
    registeredAt: new Date('2025-03-01T10:00:00.000Z'),
  });
  userProfiles.push({ userId: adminId, profileId: 5 });

  return { users, clients, employees, userProfiles, adminId };
}
