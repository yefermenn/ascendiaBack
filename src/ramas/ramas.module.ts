import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RamasController } from './ramas.controller';
import { RamasService } from './ramas.service';
import { Ramas } from '../database/entities/entities/Ramas';
import { Usuarios } from '../database/entities/entities/Usuarios';

@Module({
  imports: [TypeOrmModule.forFeature([Ramas, Usuarios])],
  controllers: [RamasController],
  providers: [RamasService],
  exports: [RamasService],
})
export class RamasModule {}
