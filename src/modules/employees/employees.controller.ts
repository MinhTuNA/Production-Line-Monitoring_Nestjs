import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,  // Trang mặc định là 1
    @Query('limit') limit: number = 10, // Số bản ghi mặc định trên một trang là 10
    @Query('sortBy') sortBy: string = 'id', // Tham số trường sắp xếp
    @Query('order') order: 'ASC' | 'DESC' = 'ASC', // Hướng sắp xếp
  ) {
    return this.employeesService.findAll(page,limit,sortBy,order);
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
