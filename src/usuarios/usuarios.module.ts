import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Usuarios } from '../database/entities/entities/Usuarios';
import { Educacion } from '../database/entities/entities/Educacion';
import { ExperienciaLaboral } from '../database/entities/entities/ExperienciaLaboral';
import { Proyectos } from '../database/entities/entities/Proyectos';
import { Cursos } from '../database/entities/entities/Cursos';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuarios,
      Educacion,
      ExperienciaLaboral,
      Proyectos,
      Cursos,
    ]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
