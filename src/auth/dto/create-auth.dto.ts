import { IsNotEmpty, IsEmail, IsOptional } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
    @IsNotEmpty({ message: "Số điện thoại không được để trống" })
    phoneNumber: string;
    @IsNotEmpty({ message: "Email không được để trống" })
    @IsEmail({}, { message: "Email không đúng định dạng" })
    email: string;
    @IsNotEmpty({ message: "vui lòng chọn role" })
    isAdmin: boolean;
    @IsNotEmpty({ message: "Mật khẩu không được để trống" })
    pass: string;
}
