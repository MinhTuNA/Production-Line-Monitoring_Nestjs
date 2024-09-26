import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateDataDto {
    @IsOptional()
    @IsString()
    time: string; // Định dạng thời gian

    @IsInt()
    @IsOptional()
    actual: number;
    
    @IsInt()
    @IsOptional()
    target: number;
}