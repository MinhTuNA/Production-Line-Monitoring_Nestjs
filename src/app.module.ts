
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthDbModule } from './modules/auth-db/auth-db.module';
import { AuthDb } from './modules/auth-db/entities/auth-db.entity';
import { EmployeesModule } from './modules/employees/employees.module';
import { Employee } from './modules/employees/entities/employee.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { RolesGuard } from './auth/passport/role-auth.guard';

@Module({
  imports: [
    AuthDbModule,
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
        // timezone: configService.get<string>('MYSQL_TIMEZONE'),
        entities: [AuthDb,Employee],
        synchronize: false,  
      }),
    }),
    AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Sau đó kiểm tra role
    },
  ],
})
export class AppModule { }
