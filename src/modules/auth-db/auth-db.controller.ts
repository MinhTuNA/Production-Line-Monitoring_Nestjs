import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthDbService } from './auth-db.service';
import { CreateAuthDbDto } from './dto/create-auth-db.dto';
import { UpdateAuthDbDto } from './dto/update-auth-db.dto';
import { CreateDataDto } from './dto/create-data.dto';

@Controller('auth-db')
export class AuthDbController {
  constructor(private readonly authDbService: AuthDbService) {}

  @Post()
  create(@Body() createAuthDbDto: CreateAuthDbDto) {
    return this.authDbService.create(createAuthDbDto);
  }

  @Get()
  findAll() {
    return this.authDbService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.authDbService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDbDto: UpdateAuthDbDto) {
    return this.authDbService.update(+id, updateAuthDbDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authDbService.remove(+id);
  }

  @Post(':tableName/actual')
  async insertActual(@Param('tableName') tableName: string, @Body() createDataDto: CreateDataDto) {
    return this.authDbService.insertActual(tableName, createDataDto);
  }
  @Post(':tableName/target')
  async insertTarget(@Param('tableName') tableName: string, @Body() createDataDto: CreateDataDto) {
    return this.authDbService.insertTarget(tableName, createDataDto);
  }

  @Get(':tableName/data')
  async getData(@Param('tableName') tableName: string) {
    return this.authDbService.getData(tableName);
  }

}
