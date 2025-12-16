import { Injectable, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuarios } from '../database/entities/entities/Usuarios';
import { Educacion } from '../database/entities/entities/Educacion';
import { ExperienciaLaboral } from '../database/entities/entities/ExperienciaLaboral';
import { Proyectos } from '../database/entities/entities/Proyectos';
import { Cursos } from '../database/entities/entities/Cursos';
import { Ramas } from '../database/entities/entities/Ramas';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { AddEducationDto } from './dto/add-education.dto';
import { AddCursoDto } from './dto/add-curso.dto';
import { AddExperienciaDto } from './dto/add-experiencia.dto';
import { AddProyectoDto } from './dto/add-proyecto.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,
    @InjectRepository(Educacion)
    private educacionRepository: Repository<Educacion>,
    @InjectRepository(ExperienciaLaboral)
    private experienciaRepository: Repository<ExperienciaLaboral>,
    @InjectRepository(Proyectos)
    private proyectosRepository: Repository<Proyectos>,
    @InjectRepository(Cursos)
    private cursosRepository: Repository<Cursos>,
    @InjectRepository(Ramas)
    private ramasRepository: Repository<Ramas>,
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
    const { account, profile, professionalField, avatar, experience } = createUsuarioDto;

    // Validar que el correo no exista
    const usuarioExistente = await this.usuariosRepository.findOne({ where: { correo: account.email } });
    if (usuarioExistente) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(account.password, 10);

    // Crear todo en una transacción
    const result = await this.usuariosRepository.manager.transaction(async (manager) => {
      const nuevoUsuario = manager.create(Usuarios, {
        nombre: `${profile.firstName} ${profile.lastName}`,
        firstName: profile.firstName,
        lastName: profile.lastName,
        correo: account.email,
        contraseAHash: passwordHash,
        fotoPerfil: profile.photoUrl || null,
        photoUrl: profile.photoUrl || null,
        biografia: profile.bio || null,
        professionalCategory: professionalField?.category || null,
        professionalSpecialty: professionalField?.specialty || null,
        avatarGender: avatar?.gender || null,
        avatarShirtColor: avatar?.shirtColor || null,
        nivelActual: account.nivel_actual,
        xpTotal: account.xp_total,
        estado: true,
        fechaRegistro: new Date(),
      });

      const usuarioGuardado = await manager.save(nuevoUsuario);

      // Educacion
      if (experience?.education && Array.isArray(experience.education)) {
        for (const edu of experience.education) {
          const educacionEntity = manager.create(Educacion, {
            externalId: edu.id || null,
            institucion: edu.institution,
            tituloObtenido: edu.degree,
            nivel: edu.level || null,
            anio: edu.year || null,
            descripcion: edu.description || null,
            url: edu.url || null,
            idUsuario: usuarioGuardado,
          });
          await manager.save(educacionEntity);
        }
      }

      // Experiencia laboral
      if (experience?.work && Array.isArray(experience.work)) {
        for (const w of experience.work) {
          const expEntity = manager.create(ExperienciaLaboral, {
            externalId: w.id || null,
            cargo: w.position,
            empresa: w.company,
            tipo: w.type || null,
            startYear: w.startYear || null,
            endYear: w.endYear || null,
            descripcion: w.description || null,
            area: w.area || null,
            url: w.url || null,
            idUsuario: usuarioGuardado,
          });
          await manager.save(expEntity);
        }
      }

      // Cursos: Ahora los cursos deben asociarse a ramas
      // Las ramas deben crearse primero y luego los cursos se agregan a esas ramas
      // Por lo tanto, no se crean cursos directamente en el registro de usuario
      // Use el endpoint POST /usuarios/:id/cursos después de crear ramas

      // Proyectos
      if (experience?.projects && Array.isArray(experience.projects)) {
        for (const p of experience.projects) {
          const proyecto = manager.create(Proyectos, {
            externalId: p.id || null,
            titulo: p.name,
            descripcion: p.description || null,
            urls: p.url && Array.isArray(p.url) ? JSON.stringify(p.url) : p.url || null,
            idUsuario: usuarioGuardado.idUsuario,
          });
          await manager.save(proyecto);
        }
      }

      const { contraseAHash, ...usuarioSinContraseña } = usuarioGuardado as any;
      return usuarioSinContraseña;
    });

    return result;
  }

  async obtenerTodos() {
    return await this.usuariosRepository.find({
      relations: ['certificaciones', 'educacions', 'experienciaLaborals', 'proyectos', 'ramas'],
    });
  }

  async obtenerPorId(id: number) {
    const usuario = await this.usuariosRepository.findOne({
      where: { idUsuario: id },
      relations: ['certificaciones', 'educacions', 'experienciaLaborals', 'proyectos', 'ramas'],
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
        'ramas',
        'ramas.cursos',
        'educacions',
        'experienciaLaborals',
        'proyectos',
      ],
    });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Aplanar todos los cursos de todas las ramas
    const todosCursos = usuario.ramas?.flatMap(rama => 
      rama.cursos?.map((c) => ({
        id: c.externalId,
        title: c.titulo,
        institution: c.institucion,
        year: c.anio,
        description: c.descripcion ?? '',
        url: c.url,
        rama: rama.nombre,
      })) || []
    ) || [];

    return {
      level: usuario.nivelActual,
      xp: usuario.xpTotal,
      account: {
        email: usuario.correo,
        password: null,        
        confirmPassword: null,  
        acceptTerms: true,      
      },

      profile: {
        firstName: usuario.firstName,
        lastName: usuario.lastName,
        bio: usuario.biografia,
        photoUrl: usuario.photoUrl,
      },

      professionalField: {
        category: usuario.professionalCategory,
        specialty: usuario.professionalSpecialty,
      },

      avatar: {
        gender: usuario.avatarGender,
        shirtColor: usuario.avatarShirtColor,
      },

      ramas: usuario.ramas?.map((rama) => ({
        id: rama.idRama,
        nombre: rama.nombre,
        cursos: rama.cursos?.map((c) => ({
          id: c.externalId,
          idCurso: c.idCurso,
          title: c.titulo,
          institution: c.institucion,
          year: c.anio,
          description: c.descripcion ?? '',
          url: c.url,
        })) || [],
      })) || [],

      experience: {
        education: usuario.educacions.map((e) => ({
          id: e.externalId,
          institution: e.institucion,
          degree: e.tituloObtenido,
          level: e.nivel,
          year: e.anio,
          description: e.descripcion,
          url: e.url,
        })),

        work: usuario.experienciaLaborals.map((w) => ({
          id: w.externalId,
          position: w.cargo,
          company: w.empresa,
          type: w.tipo,
          startYear: w.startYear,
          endYear: w.endYear,
          description: w.descripcion,
          area: w.area,
          url: w.url,
        })),

        courses: todosCursos,

        projects: usuario.proyectos.map((p) => ({
          id: p.externalId,
          name: p.titulo,
          description: p.descripcion,
          url: p.urls ? JSON.parse(p.urls) : [],
        })),
      },
    };
  }

  async agregarEducacionAUsuario(idUsuario: number, dto: AddEducationDto) {
    const usuario = await this.usuariosRepository.findOne({ where: { idUsuario } });
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const nuevaEducacion = this.educacionRepository.create({
      externalId: dto.externalId ?? null,
      institucion: dto.institucion ?? null,
      tituloObtenido: dto.tituloObtenido ?? null,
      nivel: dto.nivel ?? null,
      anio: dto.anio ?? null,
      descripcion: dto.descripcion ?? null,
      url: dto.url ?? null,
      idUsuario: usuario,
    });

    const guardada = await this.educacionRepository.save(nuevaEducacion);
    return {
      success: true,
      message: 'Educación agregada correctamente',
      data: guardada,
    };
  }

  async agregarCursoAUsuario(idUsuario: number, dto: AddCursoDto) {
    const usuario = await this.usuariosRepository.findOne({ where: { idUsuario } });
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const rama = await this.ramasRepository.findOne({ 
      where: { idRama: dto.ramaId },
      relations: ['usuario'],
    });
    
    if (!rama) {
      throw new BadRequestException('Rama no encontrada');
    }

    // Validar que la rama pertenezca al usuario
    if (rama.usuario.idUsuario !== idUsuario) {
      throw new BadRequestException('La rama no pertenece a este usuario');
    }

    const nuevoCurso = this.cursosRepository.create({
      externalId: dto.externalId || null,
      titulo: dto.titulo || '',
      institucion: dto.institucion || null,
      anio: dto.anio || null,
      descripcion: dto.descripcion || null,
      url: dto.url || null,
      rama: rama,
    });

    const guardado = await this.cursosRepository.save(nuevoCurso);
    return {
      success: true,
      message: 'Curso agregado correctamente',
      data: guardado,
    };
  }

  async agregarExperienciaAUsuario(idUsuario: number, dto: AddExperienciaDto) {
    const usuario = await this.usuariosRepository.findOne({ where: { idUsuario } });
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const nuevaExperiencia = this.experienciaRepository.create({
      externalId: dto.externalId || null,
      cargo: dto.cargo || null,
      empresa: dto.empresa || null,
      tipo: dto.tipo || null,
      startYear: dto.startYear || null,
      endYear: dto.endYear || null,
      descripcion: dto.descripcion || null,
      area: dto.area || null,
      url: dto.url || null,
      idUsuario: usuario,
    });

    const guardada = await this.experienciaRepository.save(nuevaExperiencia);
    return {
      success: true,
      message: 'Experiencia laboral agregada correctamente',
      data: guardada,
    };
  }

  async agregarProyectoAUsuario(idUsuario: number, dto: AddProyectoDto) {
    const usuario = await this.usuariosRepository.findOne({ where: { idUsuario } });
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const nuevoProyecto = this.proyectosRepository.create({
      externalId: dto.externalId || null,
      titulo: dto.titulo || '',
      descripcion: dto.descripcion || null,
      urls: dto.urls ? JSON.stringify(dto.urls) : null,
      idUsuario: usuario.idUsuario,
    });

    const guardado = await this.proyectosRepository.save(nuevoProyecto);
    return {
      success: true,
      message: 'Proyecto agregado correctamente',
      data: guardado,
    };
  }

    async addExperienceByEmail(correo: string, amount: number) {
      const usuario = await this.usuariosRepository.findOne({ where: { correo } });

      if (!usuario) {
        throw new BadRequestException('Usuario no encontrado');
      }

      // Normalizar valores nulos
      let currentXp = usuario.xpTotal ?? 0;
      let currentLevel = usuario.nivelActual ?? 0;

      currentXp += amount;

      // Si llega a 500 o más, incrementar niveles y restar 500 por cada nivel
      while (currentXp >= 500) {
        currentLevel += 1;
        currentXp -= 500;
      }

      usuario.xpTotal = currentXp;
      usuario.nivelActual = currentLevel;

      const saved = await this.usuariosRepository.save(usuario);

      return {
        correo: saved.correo,
        nivelActual: saved.nivelActual,
        xpTotal: saved.xpTotal,
      };
    }

    async login(loginDto: LoginDto) {
      const { correo, contraseña } = loginDto;

      // Validar que el correo existe
      const usuario = await this.usuariosRepository.findOne({ where: { correo } });

      if (!usuario) {
        throw new UnauthorizedException('El correo no existe');
      }

      // Comparar contraseña con bcrypt (desencriptar/validar)
      const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseAHash);

      if (!contraseñaValida) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      // Generar número aleatorio
      const numeroAleatorio = Math.floor(Math.random() * 1000000);

      return {
        success: true,
        message: 'Login exitoso',
        usuario: {
          idUsuario: usuario.idUsuario,
          nombre: usuario.nombre,
          correo: usuario.correo,
          nivelActual: usuario.nivelActual,
          xpTotal: usuario.xpTotal,
        },
        token: numeroAleatorio,
      };
    }
}
