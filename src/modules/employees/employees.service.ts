import { EmployeesController } from './employees.controller';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository, Like } from 'typeorm';
import { hashPasswordHelper } from 'src/helper/util';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';


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

  async create(createEmployeeDto: CreateEmployeeDto, user: any) {
    const { name, phoneNumber, email, isAdmin, pass } = createEmployeeDto

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
      name,
      phoneNumber,
      email,
      isAdmin,
      pass: hashPassword,
      created_by: user.id,
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


  async findAllMember(page: number, limit: number, sortBy: string = 'id', order: 'ASC' | 'DESC' = 'ASC', user: any) {
    const offset = (page - 1) * limit;
    const [result, total] = await this.EmployeeRepository.findAndCount({
      where: { created_by: user.id },
      skip: offset,
      take: limit,
      order: {
        [sortBy]: order,
      },
    });

    const totalPages = Math.ceil(total / limit);
    return {
      data: result,
      total: total,
      totalPages: totalPages,
    };
  }


  findOne(id: number) {
    const employee = this.EmployeeRepository.findOne({
      where: { id: id }
    })
    if (!employee) {
      throw new Error(`Employee with ID ${id} not found`);
    }
    return employee; // Trả về thông tin nhân viên
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
    const { id, name, email, phoneNumber, isAdmin, pass, } = updateEmployeeDto;
    if (!id) {
      throw new BadRequestException('ID is required for updating employee');
    }

    const employee = await this.EmployeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    const isEmailExist = await this.isEmailExist(email);
    const isPhoneNumberExist = await this.isPhoneNumberExist(phoneNumber);

    if (isEmailExist && email !== employee.email) {
      throw new BadRequestException("Email đã tồn tại");
    }

    if (isPhoneNumberExist && phoneNumber !== employee.phoneNumber) {
      throw new BadRequestException("SDT đã tồn tại");
    }


    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (phoneNumber) data.phoneNumber = phoneNumber;
    data.isAdmin = isAdmin;

    // Chỉ cập nhật mật khẩu nếu có giá trị
    if (pass) {
      const hashPassword = await hashPasswordHelper(pass);
      data.pass = hashPassword; // Gán mật khẩu đã mã hóa
    }
    // Cập nhật nhân viên
    await this.EmployeeRepository.update(id, data);
    return { message: 'Employee updated successfully' };
  }


  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('ID is required for deleting employee');
    }
    await this.EmployeeRepository.delete(id);
    return { message: 'Employee deleted successfully' };
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, phoneNumber, email, isAdmin, pass } = registerDto

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
      name,
      phoneNumber,
      email,
      isAdmin,
      pass: hashPassword,
    })

    return await this.EmployeeRepository.save(employee);

    // trả ra phản hồi


  }


}
