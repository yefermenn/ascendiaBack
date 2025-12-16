import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RamasController } from './ramas.controller';
import { RamasService } from './ramas.service';
import { Ramas } from '../database/entities/entities/Ramas';

@Module({
  imports: [TypeOrmModule.forFeature([Ramas])],
  controllers: [RamasController],
  providers: [RamasService],
  exports: [RamasService],
})
export class RamasModule {}
