import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity'; // Import entity User

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Inject repository của entity User
  ) {}

  // Tạo mới user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto); // Tạo đối tượng User từ DTO
    return await this.userRepository.save(newUser); // Lưu vào database
  }

  // Lấy danh sách tất cả user
  async findAll(): Promise<User[]> {
    return await this.userRepository.find(); // Truy vấn tất cả các user
  }

  // Lấy một user theo ID
  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id }); // Truy vấn user theo ID
  }

  // Cập nhật thông tin user
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto); // Cập nhật user theo ID
    return this.findOne(id); // Trả về user sau khi cập nhật
  }

  // Xóa một user
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id); // Xóa user theo ID
  }
}
