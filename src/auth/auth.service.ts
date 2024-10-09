import { compareHashPasswordHelper } from 'src/helper/util';
import { EmployeesService } from './../modules/employees/employees.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private employeeService: EmployeesService,
    private jwtService: JwtService,
  ) { }

  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.employeeService.findByUser(userName);
    const isValidPassword = await compareHashPasswordHelper(password, user.pass);

    if (!user || !isValidPassword) return null;
    return user;

  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      isAdmin: user.isAdmin,
      email: user.email,
      phoneNumber: user.phoneNumber,
      name: user.name,

    };
    return {
      auth: true, // Có thể trả về giá trị này để cho biết đã xác thực thành công
      token: this.jwtService.sign(payload), // Trả về token
      id: user.id, // Trả về ID người dùng
      email: user.email,
      phoneNumber: user.phoneNumber,
      name: user.name,
      isAdmin: user.isAdmin, // Trả về vai trò của người dùng
    };
  }

  async handleRegister(registerDto: CreateAuthDto) {
    return this.employeeService.handleRegister(registerDto)
  }

  async genAuthString(tableName: any) {
    const payload = { tableName };
    return this.jwtService.sign(payload, { expiresIn: '999 years' })
  }

}