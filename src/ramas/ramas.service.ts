import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ramas } from '../database/entities/entities/Ramas';
import { CreateRamaDto } from './dto/create-rama.dto';

@Injectable()
export class RamasService {
  constructor(
    @InjectRepository(Ramas)
    private ramasRepository: Repository<Ramas>,
  ) {}

  async crearRama(createRamaDto: CreateRamaDto): Promise<Ramas> {
    const nuevaRama = this.ramasRepository.create(createRamaDto);
    return await this.ramasRepository.save(nuevaRama);
  }

  async obtenerTodas(): Promise<Ramas[]> {
    return await this.ramasRepository.find({
      relations: ['cursos'],
    });
  }

  async obtenerPorId(id: number): Promise<Ramas> {
    const rama = await this.ramasRepository.findOne({
      where: { idRama: id },
      relations: ['cursos'],
    });

    if (!rama) {
      throw new NotFoundException(`Rama con ID ${id} no encontrada`);
    }

    return rama;
  }
}
