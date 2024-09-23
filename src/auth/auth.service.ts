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

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.employeeService.findByEmail(email);
    const isValidPassword = await compareHashPasswordHelper(password, user.pass);
    if (!isValidPassword) {
      throw new UnauthorizedException("Email/PassWord không hợp lệ");
    }
    const payload = {
      sub: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      name: user.name,
      role: user.role
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };

  }
}