import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from 'src/database/entities/entities/Usuarios';

@Injectable()
export class TestDbService {
  constructor(
    @InjectRepository(Usuarios)
    private readonly usuarioRepo: Repository<Usuarios>,
  ) {}

  async listarUsuarios() {
    return await this.usuarioRepo.find();
  }
}
