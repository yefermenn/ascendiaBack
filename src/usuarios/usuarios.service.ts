import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuarios } from '../database/entities/entities/Usuarios';
import { Educacion } from '../database/entities/entities/Educacion';
import { ExperienciaLaboral } from '../database/entities/entities/ExperienciaLaboral';
import { Proyectos } from '../database/entities/entities/Proyectos';
import { Cursos } from '../database/entities/entities/Cursos';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

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

      // Cursos
      if (experience?.courses && Array.isArray(experience.courses)) {
        for (const c of experience.courses) {
          const curso = manager.create(Cursos, {
            externalId: c.id || null,
            titulo: c.title,
            institucion: c.institution || null,
            anio: c.year || null,
            descripcion: c.description || null,
            url: c.url || null,
            idUsuario: usuarioGuardado,
          });
          await manager.save(curso);
        }
      }

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
      relations: ['certificaciones', 'educacions', 'experienciaLaborals', 'proyectos'],
    });
  }

  async obtenerPorId(id: number) {
    const usuario = await this.usuariosRepository.findOne({
      where: { idUsuario: id },
      relations: ['certificaciones', 'educacions', 'experienciaLaborals', 'proyectos'],
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
        'cursos',
        'educacions',
        'experienciaLaborals',
        'proyectos',
      ],
    });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

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

        courses: usuario.cursos.map((c) => ({
          id: c.externalId,
          title: c.titulo,
          institution: c.institucion,
          year: c.anio,
          description: c.descripcion ?? '',
          url: c.url,
        })),

        projects: usuario.proyectos.map((p) => ({
          id: p.externalId,
          name: p.titulo,
          description: p.descripcion,
          url: p.urls ? JSON.parse(p.urls) : [],
        })),
      },
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
}
