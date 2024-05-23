import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1]
    if(!token) throw new UnauthorizedException('No se envió el token');

    const secret = process.env.JWT_SECRET;

    const user = this.jwtService.verify(token, {secret});
    if(!user) throw new UnauthorizedException('Error al validar el token');

    user.exp = new Date(user.exp * 1000);

    user.roles = user.isAdmin ? ['admin'] : ['user'];

    request.user = user;
    
    return true;
  }
  }