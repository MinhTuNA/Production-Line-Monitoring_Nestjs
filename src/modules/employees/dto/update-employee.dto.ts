import { IsString, IsEmail, IsOptional, IsUUID, IsEmpty, IsNotEmpty } from 'class-validator';

export class UpdateEmployeeDto {
    @IsNotEmpty()
    id: string;
    @IsString()
    @IsOptional()
    name: string;
    @IsString()
    @IsOptional()
    phoneNumber: string;
    @IsEmail()
    @IsOptional()
    email: string;
    @IsString()
    @IsOptional()
    role: string;
}
