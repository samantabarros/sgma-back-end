import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';
import paginate from 'src/assets/paginate';
import { Matricula } from '../matricula/entities/matricula.entity';

@Injectable()
export class ModulosService {
  constructor(private prisma: PrismaService) {}
  //Dessa forma o service não fica refem do Prisma (desaclopa)
  async create(data: CreateModuloDto) {
    const moduloExists = await this.prisma.modulo.findFirst({
      where: {
        nome_modulo: data.nome_modulo,
      },
    });

    if (moduloExists) {
      throw new ConflictException('Esse modulo já esta cadastrado no sistema');
    }
    const modulo = await this.prisma.modulo.create({
      data,
    });
    return modulo;
  }

  async findAll() {
    return this.prisma.modulo.findMany({
      orderBy: {
        nome_modulo: 'asc',
      },
    });
  }

  async findById(
    id: string,
    pagina: number,
    itensPorPagina: number,
    busca?: string,
  ) {
    const queries = {
      id_modulo: id,
    };
    return paginate({
      module: 'matricula',
      busca,
      pagina,
      itensPorPagina,
      include: {
        alunoId: true,
      },
      queries,
      buscaPor: {
        alunoId: {
          nome_aluno: {
            contains: busca,
            mode: 'insensitive',
          },
        },
      },
      ordenacao: {
        alunoId: {
          nome_aluno: 'asc',
        },
      },
    });
  }

  async update(id: string, data: UpdateModuloDto) {
    const moduloExists = await this.prisma.modulo.findFirst({
      where: {
        id,
      },
    });

    if (!moduloExists) {
      throw new Error('Esse modulo nao existe!');
    }
    return await this.prisma.modulo.update({
      data,
      where: {
        id,
      },
    });
  }

  //Exclui modulo
  async delete(id: string) {
    const moduloExists = await this.prisma.modulo.findUnique({
      where: {
        id,
      },
    });

    if (!moduloExists) {
      throw new Error('Esse modulo nao existe!');
    } else {
      const existeAlunos = await this.prisma.matricula.findMany({
        where: {
          id_modulo: id,
        },
      });

      if (existeAlunos) {
        await this.prisma.matricula.deleteMany({
          where: {
            id_modulo: id,
          },
        });
      }
      const res = await this.prisma.modulo.delete({
        where: {
          id,
        },
      });
      return res;
    }
  } //fim de delete
} //fim class ModulosService
