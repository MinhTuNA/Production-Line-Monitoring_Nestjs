import { IsEmail } from 'class-validator';
import { EmployeesController } from './employees.controller';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository, Like } from 'typeorm';
import { hashPasswordHelper } from 'src/helper/util';


@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private EmployeeRepository: Repository<Employee>,
  ) { }

  isEmailExist = async (email: string) => {
    const existingEmail = await this.EmployeeRepository.findOne({ where: { email } });
    if (existingEmail) return true;
    return false;
  }

  isPhoneNumberExist = async (phoneNumber: string) => {
    const existingPhoneNumber = await this.EmployeeRepository.findOne({ where: { phoneNumber } });
    if (existingPhoneNumber) return true;
    return false;
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { name, phoneNumber, email, role, pass } = createEmployeeDto

    const isEmailExist = await this.isEmailExist(email);
    const isPhoneNumberExist = await this.isPhoneNumberExist(phoneNumber);

    if (isEmailExist) {
      throw new BadRequestException("Email đã tồn tại");
    }

    if (isPhoneNumberExist) {
      throw new BadRequestException("SDT đã tồn tại");
    }

    const hashPassword = await hashPasswordHelper(pass);
    const employee = this.EmployeeRepository.create({
      name, phoneNumber, email, role, pass: hashPassword
    })

    return this.EmployeeRepository.save(employee);
  }

  async findAll(page: number, limit: number, sortBy: string = 'id', order: 'ASC' | 'DESC' = 'ASC') {
    const offset = (page - 1) * limit;
    const [result, total] = await this.EmployeeRepository.findAndCount({
      skip: offset,
      take: limit,
      order: {
        [sortBy]: order, // Thêm điều kiện sắp xếp
      },
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

  async findByUser(account: string) {
    return await this.EmployeeRepository.findOne({
      where: [
        { email: account },
        { phoneNumber: account }
      ]
    });
  }

  async update(updateEmployeeDto: UpdateEmployeeDto) {
    const { id, ...updateData } = updateEmployeeDto;
    if (!id) {
      throw new BadRequestException('ID is required for updating employee');
    }
    return await this.EmployeeRepository.update(id, updateData);

  }


  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('ID is required for deleting employee');
    }
    return await this.EmployeeRepository.delete(id);
  }
}
