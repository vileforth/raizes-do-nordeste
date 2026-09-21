import { Module } from '@nestjs/common';
import { GeoModule } from '../geo/geo.module';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

@Module({
  imports: [GeoModule],
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}
