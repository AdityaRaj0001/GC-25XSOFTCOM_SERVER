import { Module } from '@nestjs/common';
import { HallRepService } from './hall-rep.service';
import { HallRepController } from './hall-rep.controller';

@Module({
  controllers: [HallRepController],
  providers: [HallRepService],
})
export class HallRepModule {}
