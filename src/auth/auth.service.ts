import { compareHashPasswordHelper } from 'src/helper/util';
import { EmployeesService } from './../modules/employees/employees.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
      email: user.email,
      phoneNumber: user.phoneNumber,
      name: user.name,
      role: user.role
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}