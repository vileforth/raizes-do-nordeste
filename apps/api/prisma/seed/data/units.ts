import { UnitStatus } from '@prisma/client';

export type SeedUnit = {
  id: number;
  name: string;
  address: string;
  phone: string;
  status: UnitStatus;
  latitude: number;
  longitude: number;
  areaCode: string;
  registeredAt: Date;
};

export const SEED_UNITS: SeedUnit[] = [
  {
    id: 1,
    name: 'Raízes Recife — Boa Viagem',
    address: 'Av. Boa Viagem, 512 - Boa Viagem, Recife/PE',
    phone: '8133324512',
    status: UnitStatus.ATIVA,
    latitude: -8.1199,
    longitude: -34.8972,
    areaCode: '81',
    registeredAt: new Date('2025-03-12T10:00:00.000Z'),
  },
  {
    id: 2,
    name: 'Raízes Salvador — Caminho das Árvores',
    address: 'Av. Tancredo Neves, 148 - Caminho das Árvores, Salvador/BA',
    phone: '7133458900',
    status: UnitStatus.ATIVA,
    latitude: -12.9816,
    longitude: -38.4552,
    areaCode: '71',
    registeredAt: new Date('2025-04-02T11:00:00.000Z'),
  },
  {
    id: 3,
    name: 'Raízes Fortaleza — Meireles',
    address: 'Av. Beira Mar, 3980 - Meireles, Fortaleza/CE',
    phone: '8532467788',
    status: UnitStatus.ATIVA,
    latitude: -3.7253,
    longitude: -38.4896,
    areaCode: '85',
    registeredAt: new Date('2025-04-18T12:00:00.000Z'),
  },
  {
    id: 4,
    name: 'Raízes Natal — Ponta Negra',
    address: 'Av. Engenheiro Roberto Freire, 3147 - Ponta Negra, Natal/RN',
    phone: '8432115566',
    status: UnitStatus.ATIVA,
    latitude: -5.8783,
    longitude: -35.1776,
    areaCode: '84',
    registeredAt: new Date('2025-05-09T13:00:00.000Z'),
  },
  {
    id: 5,
    name: 'Raízes João Pessoa — Tambaú',
    address: 'Av. Almirante Tamandaré, 100 - Tambaú, João Pessoa/PB',
    phone: '8332249090',
    status: UnitStatus.ATIVA,
    latitude: -7.1186,
    longitude: -34.8264,
    areaCode: '83',
    registeredAt: new Date('2025-05-27T14:00:00.000Z'),
  },
  {
    id: 6,
    name: 'Raízes Maceió — Pajuçara',
    address: 'Av. Dr. Antônio Gouveia, 1223 - Pajuçara, Maceió/AL',
    phone: '8233234411',
    status: UnitStatus.ATIVA,
    latitude: -9.6672,
    longitude: -35.7156,
    areaCode: '82',
    registeredAt: new Date('2025-06-14T15:00:00.000Z'),
  },
];
