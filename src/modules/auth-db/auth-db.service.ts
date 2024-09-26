import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDbDto } from './dto/create-auth-db.dto';
import { UpdateAuthDbDto } from './dto/update-auth-db.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDb } from './entities/auth-db.entity';
import { EntityManager, Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateDataDto } from './dto/create-data.dto';
import dayjs from 'dayjs';


@Injectable()
export class AuthDbService {
  constructor(
    @InjectRepository(AuthDb)
    private readonly authDbRepository: Repository<AuthDb>,
    private readonly authService: AuthService,
    private readonly entityManager: EntityManager,
  ) { }

  isTableNameExist = async (table_name: string) => {
    const existingEmail = await this.authDbRepository.findOne({ where: { table_name } });
    if (existingEmail) return true;
    return false;
  }


  async create(createAuthDbDto: CreateAuthDbDto): Promise<{ message: string }> {
    const { table_name } = createAuthDbDto;

    const isTableNameExist = await this.isTableNameExist(table_name);

    if (isTableNameExist) {
      throw new BadRequestException("Tên đã tồn tại");
    }

    const auth_string = await this.authService.genAuthString(table_name);
    const newAuth = this.authDbRepository.create({ table_name, auth_string });
    await this.createDynamicTable(table_name);
    await this.authDbRepository.save(newAuth);
    return { message: "Thành công" }
  }

  private async createDynamicTable(tableName: string) {
    try {
      const createTableQuery = `
            CREATE TABLE \`${tableName}\` (
              id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
              Time DATETIME NOT NULL UNIQUE,
              Actual INT DEFAULT 0,
              Target INT DEFAULT 0
            );
          `;
      await this.entityManager.query(createTableQuery);
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async insertActual(tableName: string, createDataDto: CreateDataDto) {
    const {actual} = createDataDto
    const startOfHour = dayjs().format("YYYY-MM-DD HH:00:00")
    const query = `INSERT INTO ?? (Time, Actual)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE Actual = Actual + VALUES(Actual);`;
    

    try {
      const result = await this.authDbRepository.manager.query(query, [tableName, startOfHour, actual]);
      return { message: 'Dữ liệu đã được ghi thành công', result };
    } catch (error) {
      throw new BadRequestException('Không thể ghi dữ liệu', error.message);
    }
  }

  
  async insertTarget(tableName: string, createDataDto: CreateDataDto) {
    const {target} = createDataDto
    const startOfHour = dayjs().format("YYYY-MM-DD HH:00:00")
    const query = `INSERT INTO ?? (Time, Target)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE Target = VALUES(Target);`;

    try {
      const result = await this.authDbRepository.manager.query(query, [tableName, startOfHour, target]);
      return { message: 'Dữ liệu đã được ghi thành công', result };
    } catch (error) {
      throw new BadRequestException('Không thể ghi dữ liệu', error.message);
    }
  }

  async getData(tableName: string) {
    const query = `SELECT * FROM ??`;
    
    try {
      const result = await this.authDbRepository.manager.query(query, [tableName]);
      return { message: 'Ghi dữ liệu thành công', data: result };
    } catch (error) {
      throw new BadRequestException('Không thể truy xuất dữ liệu', error.message);
    }
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
