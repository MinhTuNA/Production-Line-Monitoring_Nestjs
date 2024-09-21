import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateEmployeeDto {

    @IsNotEmpty({message: "Tên không được để trống"})
    Name: string;
    @IsNotEmpty({message: "Số điện thoại không được để trống"})
    PhoneNumber: string;
    @IsNotEmpty({message: "Email không được để trống"})
    @IsEmail({},{ message: "Email không đúng định dạng"})
    Email: string;
    @IsNotEmpty({message: "vui lòng chọn role"})
    Role: string;
    @IsNotEmpty({message: "Mật khẩu không được để trống"})
    Pass: string;
}
