import { ApiHideProperty, PickType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength, Validate, isNotEmpty, isString, minLength } from "class-validator";
import { MatchPassword } from "src/decorators/matchPassword.decorators";
import { Orders } from "src/entities/orders.entity";

export class CreateUserDTO {

    id: string;
    orders: Orders [];

    /**
     * Debe tener entre 3 y 80 carácteres.
     * @example 'Test'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    name: string;

    /**
     * Debe ingresar un email válido.
     * @example 'test@example.com'
     */
    @IsNotEmpty()
    @IsEmail()
    email: string;

    /**
     * Debe tener 8 carácteres, con al menos una minúscula y una mayúscula.
     * @example '123456789Mm'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/^[A-Za-z\d]+$/)
    password: string;

    /**
     * Debe ser igual que la contraseña ingresada.
     * @example '123456789Mm'
     */
    @IsNotEmpty()
    @Validate(MatchPassword, ['password'])
    confirmPassword: string;

    /**
     * Debe ser un número de teléfono válido.
     * @example '123456789'
     */
    @IsNotEmpty()
    @IsNumber()
    phone: number;

    /**
     * Debe tener un país entre 4 y 20 carácteres.
     * @example 'Avenida Test 1234'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    country: string;

    /**
     * Debe tener una dirección entre 5 y 50 carácteres.
     * @example 'Avenida Test 1234'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    address: string;

    /**
     * Debe tener una ciudad entre 4 y 20 carácteres.
     * @example 'Test'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    city: string;

    @ApiHideProperty()
    @IsEmpty()
    isAdmin: boolean;

    /**
     * Debe tener una fecha de nacimiento válida.
     * @example 'YYYY/MM/DD'
     */
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => {
        const [day, month, year] = value.split('/');
        return `${year}-${month}-${day}`;
    })
    birthday: string;

}

export class LoginUserDTO extends PickType(CreateUserDTO, [
    'email',
    'password'
]) {}