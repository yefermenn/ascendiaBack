import { Controller, Post, Get, Param, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

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
}
