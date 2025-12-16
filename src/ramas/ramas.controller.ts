import { Controller, Post, Get, Param, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { RamasService } from './ramas.service';
import { CreateRamaDto } from './dto/create-rama.dto';

@Controller('ramas')
export class RamasController {
  constructor(private readonly ramasService: RamasService) {}

  /**
   * Crear una nueva rama
   * POST /ramas
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crearRama(@Body() createRamaDto: CreateRamaDto) {
    return {
      success: true,
      message: 'Rama creada exitosamente',
      data: await this.ramasService.crearRama(createRamaDto),
    };
  }

  /**
   * Obtener todas las ramas
   * GET /ramas
   */
  @Get()
  async obtenerTodas() {
    return {
      success: true,
      data: await this.ramasService.obtenerTodas(),
    };
  }

  /**
   * Obtener rama por ID
   * GET /ramas/:id
   */
  @Get(':id')
  async obtenerPorId(@Param('id') id: number) {
    return {
      success: true,
      data: await this.ramasService.obtenerPorId(Number(id)),
    };
  }

  /**
   * Obtener ramas de un usuario
   * GET /ramas/usuario/:usuarioId
   */
  @Get('usuario/:usuarioId')
  async obtenerPorUsuario(@Param('usuarioId') usuarioId: number) {
    return {
      success: true,
      data: await this.ramasService.obtenerPorUsuario(Number(usuarioId)),
    };
  }
}
