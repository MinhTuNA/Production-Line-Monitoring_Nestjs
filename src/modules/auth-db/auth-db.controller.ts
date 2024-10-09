import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, Request } from '@nestjs/common';
import { AuthDbService } from './auth-db.service';
import { CreateAuthDbDto } from './dto/create-auth-db.dto';
import { UpdateAuthDbDto } from './dto/update-auth-db.dto';
import { CreateDataDto } from './dto/create-data.dto';

@Controller('auth-db')
export class AuthDbController {
  constructor(private readonly authDbService: AuthDbService) { }

  @Post()
  create(@Body() createAuthDbDto: CreateAuthDbDto, @Request() req) {
    return this.authDbService.create(createAuthDbDto, req.user);
  }

  @Get()
  findAll() {
    return this.authDbService.findAll();
  }

  @Patch('update/member')
  updateMember(@Body() updateAuthDbDto: UpdateAuthDbDto) {
    return this.authDbService.updateMember(updateAuthDbDto)
  }

  @Delete('remove/member')
  RemoveMember(@Query() updateAuthDbDto: UpdateAuthDbDto) {
    return this.authDbService.removeMember(updateAuthDbDto)
  }

  @Get('table/member')
  findAllMember(@Query('tableName') tableName: string) {
    return this.authDbService.findAllMembers(tableName)
  }

  @Get('table_names')
  async findAllTableNames(@Request() req) {
    return this.authDbService.findAllTableNames(req.user);
  }

  @Get('id_camera')
  async getCameraId(@Query('tableName') tableName: string) {
    return this.authDbService.getCameraId(tableName);
  }

  @Post('id_camera')
  async setCameraId(@Body() createAuthDbDto: CreateAuthDbDto & { tableName: string }) {
    const { tableName } = createAuthDbDto;
    return this.authDbService.setCameraId(tableName, createAuthDbDto);
  }

  @Get('auth_token')
  async getAuthToken(@Query('tableName') tableName: string) {
    return this.authDbService.getAuthToken(tableName);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.authDbService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDbDto: UpdateAuthDbDto) {
    return this.authDbService.update(+id, updateAuthDbDto);
  }

  @Delete(':tableName')
  remove(@Param('tableName') tableName: string) {
    return this.authDbService.remove(tableName);
  }

  @Post('/data/actual')
  async insertActual(@Body() createDataDto: CreateDataDto & { tableName: string }) {
    const { tableName } = createDataDto;  // Lấy tableName từ body
    return this.authDbService.insertActual(tableName, createDataDto);
  }

  @Post('/data/target')
  async insertTarget(@Body() createDataDto: CreateDataDto & { tableName: string }) {
    const { tableName } = createDataDto;
    return this.authDbService.insertTarget(tableName, createDataDto);
  }

  @Get('/data/all_data')
  async getAllData(@Query('tableName') tableName: string) {
    return this.authDbService.getAllData(tableName);
  }

  @Get('/data/now')
  async getDataNow(@Query('tableNames') tableNames: string[]) {
    if (!tableNames || !Array.isArray(tableNames) || tableNames.length === 0) {
      throw new BadRequestException('Thiếu tên bảng hoặc tên bảng không hợp lệ');
    }
    return this.authDbService.getDataNow(tableNames);
  }

  @Get('/data/day')
  async getDataDay(@Query('tableNames') tableNames: string[]) {
    if (!tableNames || !Array.isArray(tableNames) || tableNames.length === 0) {
      throw new BadRequestException('Thiếu tên bảng hoặc tên bảng không hợp lệ');
    }
    return this.authDbService.getDataDay(tableNames);
  }

  @Get("/data/data_in_range")
  findByRange(
    @Query('tableName') tableName: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.authDbService.findByRange(tableName, fromDate, toDate);
  }

}
