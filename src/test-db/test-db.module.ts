import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDbService } from './test-db.service';
import { TestDbController } from './test-db.controller';
import { Usuarios } from '../database/entities/entities/Usuarios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuarios]),
  ],
  controllers: [TestDbController],
  providers: [TestDbService],
})
export class TestDbModule {}
