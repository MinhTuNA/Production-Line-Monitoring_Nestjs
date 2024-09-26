import { IsString, IsEmail, IsOptional, IsUUID, IsEmpty, IsNotEmpty } from 'class-validator';

export class UpdateEmployeeDto {
    @IsNotEmpty()
    id: number;
    @IsString()
    @IsOptional()
    name: string;
    @IsString()
    @IsOptional()
    phoneNumber: string;
    @IsEmail()
    @IsOptional()
    email: string;
    @IsOptional()
    pass: string;
    @IsString()
    @IsOptional()
    role: string;
}
