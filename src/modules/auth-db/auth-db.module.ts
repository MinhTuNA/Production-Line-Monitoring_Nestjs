import { Module } from '@nestjs/common';
import { AuthDbService } from './auth-db.service';
import { AuthDbController } from './auth-db.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthDb } from './entities/auth-db.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuthDb]), AuthModule ],
  controllers: [AuthDbController],
  providers: [AuthDbService],
})
export class AuthDbModule {}
