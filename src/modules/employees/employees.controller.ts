import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Request } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto, @Request() req) {
    return this.employeesService.create(createEmployeeDto, req.user);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'id',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.employeesService.findAll(page, limit, sortBy, order);
  }

  @Get('member')
  async findAllMember(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'id',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Request() req
  ) {
    return this.employeesService.findAllMember(page, limit, sortBy, order, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.employeesService.findOne(id);
  }

  @Patch()
  update(@Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }



}
