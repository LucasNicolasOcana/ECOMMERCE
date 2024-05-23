import { Body, Controller, Post, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDTO, LoginUserDTO } from "src/users/users.dto";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

@Get()
  getAuth() {
    return this.authService.getAuth();
  }

@Post('signin')
signIn(@Body() credentials: LoginUserDTO) {
  const { email, password } = credentials;
  return this.authService.signIn(email, password);
  }

@Post('signup') 
signUp(@Body() user: CreateUserDTO) {
  return this.authService.signUp(user);
  }
}
