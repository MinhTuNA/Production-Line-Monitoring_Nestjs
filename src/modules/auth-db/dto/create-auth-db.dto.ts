import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
export class CreateAuthDbDto {
    @IsNotEmpty()
    @IsString()
    table_name: string;

    @IsOptional()
    auth_string: string;

    @IsOptional()
    id_camera?: string;
    @IsOptional()
    created_by?: string;
}
