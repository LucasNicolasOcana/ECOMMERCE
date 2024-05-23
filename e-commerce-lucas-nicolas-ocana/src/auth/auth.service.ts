import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities/users.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService
  ) {}

  async getAuth(): Promise<string> {
    const authInfo = 'Información de autenticación';
    return authInfo;
  }
  async signIn(email: string, password: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if(!user) throw new BadRequestException('Credenciales incorrectas');

    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) throw new BadRequestException('Credenciales incorrectas');
    
    const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin };
    const token = this.jwtService.sign(payload);
    return {
      message: 'Usuario logueado',
      token,
    }
  }

  async signUp(user: Partial<Users>) {
    const { email, password } = user;
    const foundUser = await this.userRepository.getUserByEmail(email);
    if(foundUser) throw new BadRequestException('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userRepository.addUser({ ...user, password: hashedPassword });
  }
}

