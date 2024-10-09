import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDbDto } from './create-auth-db.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAuthDbDto extends PartialType(CreateAuthDbDto) {
    @IsNotEmpty()
    @IsString()
    table_name: string;

    @IsOptional()
    auth_string: string;

    @IsOptional()
    id_camera?: string;
    @IsOptional()
    created_by?: string;
    @IsOptional()
    member?: string;
}
