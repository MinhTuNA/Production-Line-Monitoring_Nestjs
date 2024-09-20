import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { Auth } from './modules/auth/entities/auth.entity';
import { EmployeesModule } from './modules/employees/employees.module';
import { Employee } from './modules/employees/entities/employee.entity';

@Module({
  imports: [
    AuthModule,
    EmployeesModule,
    ConfigModule.forRoot(
      { isGlobal: true }
    ),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASS'),
        database: configService.get<string>('MYSQL_DATABASE'),
        entities: [Auth,Employee],
        synchronize: true,  // Đồng bộ schema tự động
      }),
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
