import { IsEmail } from 'class-validator';
import { EmployeesController } from './employees.controller';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { hashPasswordHelper } from 'src/helper/util';
import aqp from 'api-query-params';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private EmployeeRepository: Repository<Employee>,
  ) { }

  isEmailExist = async (Email: string) => {
    const existingEmail = await this.EmployeeRepository.findOne({ where: { Email } });
    if (existingEmail) return true;
    return false;
  }

  isPhoneNumberExist = async (PhoneNumber: string) => {
    const existingPhoneNumber = await this.EmployeeRepository.findOne({ where: { PhoneNumber } });
    if (existingPhoneNumber) return true;
    return false;
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { Name, PhoneNumber, Email, Role, Pass } = createEmployeeDto

    const isEmailExist = await this.isEmailExist(Email);
    const isPhoneNumberExist = await this.isPhoneNumberExist(PhoneNumber);

    if (isEmailExist) {
      throw new BadRequestException("Email đã tồn tại");
    }

    if (isPhoneNumberExist) {
      throw new BadRequestException("SDT đã tồn tại");
    }

    const hashPassword = await hashPasswordHelper(Pass);
    const employee = this.EmployeeRepository.create({
      Name, PhoneNumber, Email, Role, Pass: hashPassword
    })

    return this.EmployeeRepository.save(employee);
  }

  async findAll(page: number, limit: number, sortBy: string = 'id', order: 'ASC' | 'DESC' = 'ASC') {
    const offset = (page - 1) * limit;
    const [result, total] = await this.EmployeeRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    const totalPages = Math.ceil(total / limit);
    return {
      data: result,
      total: totalPages,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
