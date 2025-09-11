import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Usuarios } from '../database/entities/entities/Usuarios';
import { Niveles } from '../database/entities/entities/Niveles';
import { Admin } from '../database/entities/entities/Admin';
import { Certificaciones } from '../database/entities/entities/Certificaciones';
import { Educacion } from '../database/entities/entities/Educacion';
import { ExperienciaLaboral } from '../database/entities/entities/ExperienciaLaboral';
import { LogrosUsuario } from '../database/entities/entities/LogrosUsuario';
import { Notificaciones } from '../database/entities/entities/Notificaciones';
import { Personajes } from '../database/entities/entities/Personajes';
import { Proyectos } from '../database/entities/entities/Proyectos';
import { Seguidores } from '../database/entities/entities/Seguidores';
import { UsuariosRedes } from '../database/entities/entities/UsuariosRedes';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuarios,
      Niveles,
      Admin,
      Certificaciones,
      Educacion,
      ExperienciaLaboral,
      LogrosUsuario,
      Notificaciones,
      Personajes,
      Proyectos,
      Seguidores,
      UsuariosRedes,
    ]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
