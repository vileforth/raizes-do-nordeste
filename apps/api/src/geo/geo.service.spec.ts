import { LoggerService } from '../logger/logger.service';
import { GeoService } from './geo.service';

describe('GeoService', () => {
  let service: GeoService;
  let logger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new GeoService(logger);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns coordinates from Nominatim response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [{ lat: '-8.0476', lon: '-34.8770' }],
    });

    const result = await service.geocodeAddress('Recife, Brazil');

    expect(result).toEqual({ latitude: -8.0476, longitude: -34.877 });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/search?'),
      expect.objectContaining({
        headers: { 'User-Agent': 'raizes-do-nordeste/1.0' },
      }),
    );
  });

  it('returns null when address is not found', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await service.geocodeAddress('Unknown place');

    expect(result).toBeNull();
  });

  it('returns null and logs when Nominatim fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 503,
    });

    const result = await service.geocodeAddress('Recife, Brazil');

    expect(result).toBeNull();
    expect(logger.warn).toHaveBeenCalled();
  });
});
