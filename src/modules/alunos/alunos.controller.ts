import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}
  //Cadastra o aluno
  @Post()
  async create(@Body() data: CreateAlunoDto) {
    return this.alunosService.create(data);
  }

  //Lista os alunos
  @Get()
  async findAll(
    @Query('pagina') pagina: number,
    @Query('itensPorPagina') itensPorPagina: number,
    @Query('busca') busca?: string,
  ) {
    return this.alunosService.findAll(pagina, itensPorPagina, busca);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
  ) {
    return this.alunosService.findById(id);
  }

  //Edita os dados de um aluno
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateAlunoDto) {
    return this.alunosService.update(id, data);
  }
  //Deleta um dado
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.alunosService.delete(id);
  }
} //fim da class AlunosService
