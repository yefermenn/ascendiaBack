import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuarios } from '../database/entities/entities/Usuarios';
import { Niveles } from '../database/entities/entities/Niveles';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,
    @InjectRepository(Niveles)
    private nivelesRepository: Repository<Niveles>,
  ) {}

  async usuarioExiste(correo:string){
     const usuarioExistente = await this.usuariosRepository.findOne({
      where: { correo },
    });

    if (usuarioExistente) {
      throw new ConflictException('El correo ya está registrado');
    }
    return {
        exists: false,
        message: 'Correo disponible',
    };
  }

  async crearUsuario(createUsuarioDto: CreateUsuarioDto) {
    const { nombre, correo, contraseña, fotoPerfil, biografia, rol } = createUsuarioDto;

    // Validar que el correo no exista
    const usuarioExistente = await this.usuariosRepository.findOne({
      where: { correo },
    });

    if (usuarioExistente) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Hash de la contraseña
    const contraseñaHash = await bcrypt.hash(contraseña, 10);

    // Obtener el nivel inicial (nivel 1)
    const nivelInicial = await this.nivelesRepository.findOne({
      where: { idNivel: 1 },
    });

    if (!nivelInicial) {
      throw new BadRequestException('No existe un nivel inicial en la base de datos');
    }

    // Crear nuevo usuario
    const nuevoUsuario = this.usuariosRepository.create({
      nombre,
      correo,
      contraseAHash: contraseñaHash,
      fotoPerfil: fotoPerfil || null,
      biografia: biografia || null,
      rol: rol || 'usuario',
      nivelActual: nivelInicial.idNivel,
      nivelActual2: nivelInicial,
      xpTotal: 0,
      estado: true,
      fechaRegistro: new Date(),
    });

    // Guardar en la base de datos
    const usuarioGuardado = await this.usuariosRepository.save(nuevoUsuario);

    // Retornar usuario sin la contraseña
    const { contraseAHash, ...usuarioSinContraseña } = usuarioGuardado;
    return usuarioSinContraseña;
  }

  async obtenerTodos() {
    return await this.usuariosRepository.find({
      relations: [
        'nivelActual2',
        'admin',
        'certificaciones',
        'educacions',
        'experienciaLaborals',
        'logrosUsuarios',
        'notificaciones',
        'personajes',
        'proyectos',
        'seguidores',
        'seguidores2',
        'usuariosRedes',
      ],
    });
  }

  async obtenerPorId(id: number) {
    const usuario = await this.usuariosRepository.findOne({
      where: { idUsuario: id },
      relations: [
        'nivelActual2',
        'admin',
        'certificaciones',
        'educacions',
        'experienciaLaborals',
        'logrosUsuarios',
        'notificaciones',
        'personajes',
        'proyectos',
        'seguidores',
        'seguidores2',
        'usuariosRedes',
      ],
    });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const { contraseAHash, ...usuarioSinContraseña } = usuario;
    return usuarioSinContraseña;
  }

  async obtenerPorCorreo(correo: string) {
    const usuario = await this.usuariosRepository.findOne({
      where: { correo },
      relations: [
        'nivelActual2',
        'admin',
        'certificaciones',
        'educacions',
        'experienciaLaborals',
        'logrosUsuarios',
        'notificaciones',
        'personajes',
        'proyectos',
        'seguidores',
        'seguidores2',
        'usuariosRedes',
      ],
    });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const { contraseAHash, ...usuarioSinContraseña } = usuario;
    return usuarioSinContraseña;
  }
}
