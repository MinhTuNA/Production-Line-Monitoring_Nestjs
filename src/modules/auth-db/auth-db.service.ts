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

  getTime = () => {
    return dayjs().format("YYYY-MM-DD HH:00:00");
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
    const { actual } = createDataDto
    const time = this.getTime();
    const query = `INSERT INTO ?? (Time, Actual)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE Actual = Actual + VALUES(Actual);`;


    try {
      const result = await this.authDbRepository.manager.query(query, [tableName, time, actual]);
      return { message: 'Dữ liệu đã được ghi thành công', result };
    } catch (error) {
      throw new BadRequestException('Không thể ghi dữ liệu', error.message);
    }
  }


  async insertTarget(tableName: string, createDataDto: CreateDataDto) {
    const { target } = createDataDto
    const time = this.getTime();
    const query = `INSERT INTO ?? (Time, Target)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE Target = VALUES(Target);`;

    try {
      const result = await this.authDbRepository.manager.query(query, [tableName, time, target]);
      return { message: 'Dữ liệu đã được ghi thành công', result };
    } catch (error) {
      throw new BadRequestException('Không thể ghi dữ liệu', error.message);
    }
  }

  async getAllData(tableName: string) {
    const query = `SELECT * FROM ??`;

    try {
      const result = await this.authDbRepository.manager.query(query, [tableName]);
      return { message: 'lấy dữ liệu liệu thành công', data: result };
    } catch (error) {
      throw new BadRequestException('Không thể truy xuất dữ liệu', error.message);
    }
  }
  async getDataNow(tableNames: string[]) {
    const timeString = this.getTime(); // Giả định có một hàm getTime() đã được định nghĩa
    const promises = tableNames.map((tableName) => {
      const query = `SELECT Time, Actual, Target FROM ?? WHERE Time = ?`;
      return new Promise((resolve, reject) => {
        this.authDbRepository.manager.query(query, [tableName, timeString])
          .then(result => resolve({ tableName, data: result }))
          .catch(err => {
            console.error(`Lỗi khi lấy dữ liệu từ bảng ${tableName}:`, err);
            reject(err);
          });
      });
    });

    try {
      const data = await Promise.all(promises);
      return { message: 'Lấy dữ liệu thành công', data };
    } catch (error) {
      throw new BadRequestException('Lỗi máy chủ', error.message);
    }
  }

  
  async getDataDay(tableNames: string[]) {
    const timeString = dayjs().format('YYYY-MM-DD');
    const promises = tableNames.map((tableName) => {
      const query = `SELECT Time, Actual, Target FROM ?? WHERE Time LIKE ?`;
      return new Promise((resolve, reject) => {
        this.authDbRepository.manager.query(query, [tableName, `${timeString}%`])
          .then(result => resolve({ tableName, data: result }))
          .catch(err => {
            console.error(`Lỗi khi lấy dữ liệu từ bảng ${tableName}:`, err);
            reject(err);
          });
      });
    });

    try {
      const data = await Promise.all(promises);
      return { message: 'Lấy dữ liệu thành công', data };
    } catch (error) {
      throw new BadRequestException('Lỗi máy chủ', error.message);
    }
  }

  async findByRange(
    tableName: string,
    fromDate?: string,
    toDate?: string,
  ): Promise<any[]> {
    let query = `
      SELECT * FROM ?? 
    `;
    const queryParams = [tableName]; // Tham số cho bảng động

    // Nếu có khoảng thời gian được cung cấp
    if (fromDate && toDate) {
      const from = dayjs(fromDate).format('YYYY-MM-DD HH:mm:ss');
      const to = dayjs(toDate).format('YYYY-MM-DD HH:mm:ss');
      query += ` WHERE Time BETWEEN ? AND ? ORDER BY Time ASC`;
      queryParams.push(from, to);
    }

    // Thực thi truy vấn với bảng động
    return await this.authDbRepository.query(query, queryParams);
  }
  findAll() {
    return `This action returns all authDb`;
  }

  async findAllTableNames(): Promise<string[]> {
    const results = await this.authDbRepository.find();
    return results.map(auth => auth.table_name); // Lấy tất cả các table_name
  }

  async getCameraId(tableName: string){
    const table = await this.authDbRepository.findOne({
      where: {table_name: tableName}
    })
    return table.id_camera
  }

  async setCameraId(tableName: string, createAuthDbDto: CreateAuthDbDto ){
    const {id_camera} = createAuthDbDto
    const table = await this.authDbRepository.findOne({
      where: {table_name: tableName}
    })
    if(!table){
      throw new BadRequestException(`không tìm thấy ${tableName}`)
    }
    await this.authDbRepository.update({table_name: tableName},{id_camera: id_camera})
    return {
      message: "cập nhật thành công"
    }
  }

  async getAuthToken(tableName: string){
    const table = await this.authDbRepository.findOne({
      where: {table_name: tableName}
    })
    return table.auth_string;
  }

  findOne(id: number) {
    return `This action returns a #${id} authDb`;
  }

  update(id: number, updateAuthDbDto: UpdateAuthDbDto) {
    return `This action updates a #${id} authDb`;
  }

  async remove(tableName: string) {
    if(!tableName)
    {
      throw new BadRequestException("chưa truyền tên bảng")
    }

    try {
      await this.authDbRepository.delete({table_name: tableName})
    } catch (error) {
      throw new BadRequestException('Lỗi khi xóa từ bảng auth-db');
    }

    

    const dropTableQuery = `DROP TABLE IF EXISTS \`${tableName}\`;`;
  
  try {
    await this.authDbRepository.manager.query(dropTableQuery);
    return { message: `Bảng ${tableName} đã được xóa thành công` };
  } catch (error) {
    console.error("Lỗi khi xóa bảng:", error);
    throw new BadRequestException(`Lỗi khi xóa bảng ${tableName}: ${error.message}`);
  }
  }
}
