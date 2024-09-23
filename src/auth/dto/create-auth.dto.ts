import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({message: "email không được bỏ trống"})
    email: string;
    @IsNotEmpty({message: "mật khẩu không được bỏ trống"})
    password: string;
}
