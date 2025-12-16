import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ramas } from '../database/entities/entities/Ramas';
import { Usuarios } from '../database/entities/entities/Usuarios';
import { CreateRamaDto } from './dto/create-rama.dto';

@Injectable()
export class RamasService {
  constructor(
    @InjectRepository(Ramas)
    private ramasRepository: Repository<Ramas>,
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,
  ) {}

  async crearRama(createRamaDto: CreateRamaDto): Promise<Ramas> {
    const usuario = await this.usuariosRepository.findOne({ 
      where: { idUsuario: createRamaDto.usuarioId } 
    });
    
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const nuevaRama = this.ramasRepository.create({
      nombre: createRamaDto.nombre,
      usuario: usuario,
    });
    
    return await this.ramasRepository.save(nuevaRama);
  }

  async obtenerTodas(): Promise<Ramas[]> {
    return await this.ramasRepository.find({
      relations: ['cursos', 'usuario'],
    });
  }

  async obtenerPorId(id: number): Promise<Ramas> {
    const rama = await this.ramasRepository.findOne({
      where: { idRama: id },
      relations: ['cursos', 'usuario'],
    });

    if (!rama) {
      throw new NotFoundException(`Rama con ID ${id} no encontrada`);
    }

    return rama;
  }

  async obtenerPorUsuario(usuarioId: number): Promise<Ramas[]> {
    return await this.ramasRepository.find({
      where: { usuario: { idUsuario: usuarioId } },
      relations: ['cursos'],
    });
  }
}
