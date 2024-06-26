import {
  ConflictException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import paginate from 'src/assets/paginate';

@Injectable()
export class MatriculaService {
  constructor(private prisma: PrismaService) {}

  //Criar (create)
  async create(data: CreateMatriculaDto) {
    const existsMatricula = await this.prisma.matricula.findFirst({
      where: {
        id_aluno: data.id_aluno,
        id_modulo: data.id_modulo,
      },
    });

    if (existsMatricula) {
      throw new HttpException(
        'Esse aluno já está cadastrado nesse módulo!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const matricula = await this.prisma.matricula.create({
      data,
    });

    return matricula;
  }

  //Ler (read) - para listar todos os módulos
  async findAll(pagina: number, itensPorPagina: number, busca?: string) {
    return paginate({
      module: 'matricula',
      busca,
      pagina,
      itensPorPagina,
      buscaPor: 'nome_modulo',
    });
  }

  //Para buscar por id
  async findById(
    id: string,
    pagina: number,
    itensPorPagina: number,
    busca?: string,
  ) {
    const queries = {
      id_aluno: id,
    };
    return paginate({
      module: 'matricula',
      busca,
      pagina,
      itensPorPagina,
      include: {
        moduloId: true,
      },
      queries,
      buscaPor: {
        moduloId: {
          nome_modulo: {
            contains: busca,
            mode: 'insensitive',
          },
        },
      },
      ordenacao: {
        moduloId: {
          nome_modulo: 'asc',
        },
      },
    });
  }

  //Editar (update)
  async update(id: string, data: UpdateMatriculaDto) {
    //Alterar essa lógica depois (enviar o id da matricula em vez do id do aluno)
    const matricula = await this.prisma.matricula.findFirst({
      where: {
        id_aluno: data.id_aluno,
        id_modulo: data.id_modulo,
      },
    });
    return this.prisma.matricula.update({
      where: { id: matricula.id },
      data,
    });
  }

  //Excluir (delete)
  async remove(id: string) {
    return this.prisma.matricula.delete({
      where: { id },
    });
  }

  // Consulta os módulos com base no id do aluno(id_aluno)
  // Busca registros na tabela Matricula que correspondem ao id do aluno e,
  // em seguida, busca os módulos associados a esses registros
  async findModulosByAlunoId(id_aluno: string) {
    return this.prisma.matricula.findMany({
      where: { id_aluno },
      include: {
        moduloId: true,
      },
    });
  }

  async findAlunosByModuloId(id_modulo: string) {
    return this.prisma.matricula.findMany({
      where: { id_modulo },
      include: {
        alunoId: true,
      },
    });
  }
}
