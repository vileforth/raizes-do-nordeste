import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

@Injectable()
export class GeoService {
  private readonly baseUrl: string;
  private readonly userAgent = 'raizes-do-nordeste/1.0';

  constructor(private readonly logger: LoggerService) {
    this.baseUrl =
      process.env.NOMINATIM_BASE_URL ?? 'https://nominatim.openstreetmap.org';
  }

  async geocodeAddress(address: string): Promise<GeoCoordinates | null> {
    const url = `${this.baseUrl}/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

    const response = await fetch(url, {
      headers: { 'User-Agent': this.userAgent },
    });

    if (!response.ok) {
      this.logger.warn('Nominatim geocode failed', {
        status: response.status,
        address,
      });
      return null;
    }

    const data = (await response.json()) as Array<{ lat: string; lon: string }>;

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    return {
      latitude: Number.parseFloat(data[0].lat),
      longitude: Number.parseFloat(data[0].lon),
    };
  }
}
