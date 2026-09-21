export type ClientLocation = {
  city: string;
  state: string;
  neighborhoods: string[];
  streets: string[];
  preferredUnitId: number;
  latitude: number;
  longitude: number;
};

export const CLIENT_LOCATIONS: Record<string, ClientLocation> = {
  '81': {
    city: 'Recife',
    state: 'PE',
    neighborhoods: ['Boa Viagem', 'Casa Forte', 'Espinheiro', 'Pina', 'Graças'],
    streets: ['Rua Setúbal', 'Av. Conselheiro Aguiar', 'Rua da Hora', 'Rua Barão de Souza Leão'],
    preferredUnitId: 1,
    latitude: -8.0476,
    longitude: -34.877,
  },
  '71': {
    city: 'Salvador',
    state: 'BA',
    neighborhoods: ['Caminho das Árvores', 'Pituba', 'Barra', 'Rio Vermelho'],
    streets: ['Av. Tancredo Neves', 'Rua das Hortênsias', 'Av. Oceânica', 'Rua da Paciência'],
    preferredUnitId: 2,
    latitude: -12.9714,
    longitude: -38.5014,
  },
  '85': {
    city: 'Fortaleza',
    state: 'CE',
    neighborhoods: ['Meireles', 'Aldeota', 'Varjota', 'Mucuripe'],
    streets: ['Av. Beira Mar', 'Rua Silva Jatahy', 'Av. Santos Dumont', 'Rua dos Tabajaras'],
    preferredUnitId: 3,
    latitude: -3.7319,
    longitude: -38.5267,
  },
  '84': {
    city: 'Natal',
    state: 'RN',
    neighborhoods: ['Ponta Negra', 'Tirol', 'Petrópolis', 'Capim Macio'],
    streets: ['Av. Engenheiro Roberto Freire', 'Rua Mipibu', 'Av. Campos Sales', 'Rua das Algarobas'],
    preferredUnitId: 4,
    latitude: -5.7945,
    longitude: -35.211,
  },
  '83': {
    city: 'João Pessoa',
    state: 'PB',
    neighborhoods: ['Tambaú', 'Manaíra', 'Bessa', 'Cabo Branco'],
    streets: ['Av. Almirante Tamandaré', 'Av. João Maurício', 'Rua Coração de Jesus', 'Av. Cabo Branco'],
    preferredUnitId: 5,
    latitude: -7.1195,
    longitude: -34.845,
  },
  '82': {
    city: 'Maceió',
    state: 'AL',
    neighborhoods: ['Pajuçara', 'Ponta Verde', 'Jatiúca', 'Ponta da Terra'],
    streets: ['Av. Dr. Antônio Gouveia', 'Av. Silvio Carlos Viana', 'Rua Jangadeiros Alagoanos', 'Av. da Paz'],
    preferredUnitId: 6,
    latitude: -9.6498,
    longitude: -35.7089,
  },
  '86': {
    city: 'Teresina',
    state: 'PI',
    neighborhoods: ['Jóquei', 'Fátima', 'Ilhotas', 'Centro'],
    streets: ['Av. Frei Serafim', 'Rua Álvaro Mendes', 'Av. Maranhão', 'Rua Coelho de Resende'],
    preferredUnitId: 3,
    latitude: -5.0892,
    longitude: -42.8019,
  },
  '98': {
    city: 'São Luís',
    state: 'MA',
    neighborhoods: ['Renascença', 'Calhau', 'Ponta d’Areia', 'Centro'],
    streets: ['Av. dos Holandeses', 'Av. Litorânea', 'Rua Grande', 'Av. Colares Moreira'],
    preferredUnitId: 3,
    latitude: -2.5307,
    longitude: -44.3068,
  },
};
