export type MapPointKind = 'unit' | 'client';

export type MapUnitPoint = {
  key: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  active: boolean;
  kind?: MapPointKind;
};
