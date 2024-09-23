import { Injectable } from '@nestjs/common';
import { CreateAuthDbDto } from './dto/create-auth-db.dto';
import { UpdateAuthDbDto } from './dto/update-auth-db.dto';

@Injectable()
export class AuthDbService {
  create(createAuthDbDto: CreateAuthDbDto) {
    return 'This action adds a new authDb';
  }

  findAll() {
    return `This action returns all authDb`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authDb`;
  }

  update(id: number, updateAuthDbDto: UpdateAuthDbDto) {
    return `This action updates a #${id} authDb`;
  }

  remove(id: number) {
    return `This action removes a #${id} authDb`;
  }
}
