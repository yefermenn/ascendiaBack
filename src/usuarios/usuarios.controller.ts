import { Controller, Post, Get, Param, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AddExperienceDto } from './dto/add-experience.dto';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { AddEducationDto } from './dto/add-education.dto';
import { AddCursoDto } from './dto/add-curso.dto';
import { AddExperienciaDto } from './dto/add-experiencia.dto';
import { AddProyectoDto } from './dto/add-proyecto.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  /**
   * Crear un nuevo usuario
   * POST /usuarios
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crearUsuario(@Body() createUsuarioDto: CreateUsuarioDto) {
    return {
      success: true,
      message: 'Usuario creado exitosamente',
      data: await this.usuariosService.crearUsuario(createUsuarioDto),
    };
  }

  /**
   * Obtener todos los usuarios
   * GET /usuarios
   */
  @Get()
  async obtenerTodos() {
    return {
      success: true,
      data: await this.usuariosService.obtenerTodos(),
    };
  }

  /**
   * Obtener usuario por ID
   * GET /usuarios/:id
   */
  @Get(':id')
  async obtenerPorId(@Param('id') id: number) {
    return {
      success: true,
      data: await this.usuariosService.obtenerPorId(id),
    };
  }

  /**
   * Obtener usuario por correo
   * GET /usuarios/email/:correo
   */
  @Get('email/:correo')
  async obtenerPorCorreo(@Param('correo') correo: string) {
    return {
      success: true,
      data: await this.usuariosService.obtenerPorCorreo(correo),
    };
  }
  @Get('exist/:correo')
  async usuarioExiste(@Param('correo') correo: string) {
    return {
      success: true,
      data: await this.usuariosService.usuarioExiste(correo),
    };
  }

  @Post('add-experience')
  @HttpCode(HttpStatus.OK)
  async addExperience(@Body() addExperienceDto: AddExperienceDto) {
    const { email, amount } = addExperienceDto as any;
    return {
      success: true,
      data: await this.usuariosService.addExperienceByEmail(email, amount),
    };
  }

  /**
   * Login de usuario
   * POST /usuarios/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.usuariosService.login(loginDto);
  }

  /**
   * Agregar educación a un usuario existente
   * POST /usuarios/:id/educacion
   */
  @Post(':id/educacion')
  @HttpCode(HttpStatus.CREATED)
  async agregarEducacion(
    @Param('id') id: number,
    @Body() addEducationDto: AddEducationDto,
  ) {
    return await this.usuariosService.agregarEducacionAUsuario(Number(id), addEducationDto);
  }

  /**
   * Agregar curso a un usuario existente
   * POST /usuarios/:id/cursos
   */
  @Post(':id/cursos')
  @HttpCode(HttpStatus.CREATED)
  async agregarCurso(
    @Param('id') id: number,
    @Body() addCursoDto: AddCursoDto,
  ) {
    return await this.usuariosService.agregarCursoAUsuario(Number(id), addCursoDto);
  }

  /**
   * Agregar experiencia laboral a un usuario existente
   * POST /usuarios/:id/experiencia
   */
  @Post(':id/experiencia')
  @HttpCode(HttpStatus.CREATED)
  async agregarExperiencia(
    @Param('id') id: number,
    @Body() addExperienciaDto: AddExperienciaDto,
  ) {
    return await this.usuariosService.agregarExperienciaAUsuario(Number(id), addExperienciaDto);
  }

  /**
   * Agregar proyecto a un usuario existente
   * POST /usuarios/:id/proyectos
   */
  @Post(':id/proyectos')
  @HttpCode(HttpStatus.CREATED)
  async agregarProyecto(
    @Param('id') id: number,
    @Body() addProyectoDto: AddProyectoDto,
  ) {
    return await this.usuariosService.agregarProyectoAUsuario(Number(id), addProyectoDto);
  }
}
