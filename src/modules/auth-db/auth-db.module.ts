import { Module } from '@nestjs/common';
import { AuthDbService } from './auth-db.service';
import { AuthDbController } from './auth-db.controller';

@Module({
  controllers: [AuthDbController],
  providers: [AuthDbService],
})
export class AuthDbModule {}
