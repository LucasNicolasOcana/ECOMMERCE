import { Body, Controller, Delete, Get, Post, Query, UseGuards, Put, Param, ParseUUIDPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/decorators/role.decorators";
import { Role } from "./roles.enum";
import { RolesGuard } from "src/auth/auth.roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Users } from "src/entities/users.entity";

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getUsers(@Query('page') page: string, @Query('limit') limit: string) {
    if(page && limit) {
      return this.userService.getUsers(Number(page), Number(limit));
    } 
    return this.userService.getUsers(1, 5);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  getUser(@Query('id', ParseUUIDPipe) id: string) {
    return this.userService.getUser(id);
  }

  @ApiBearerAuth()
  @Put(':id') 
  @UseGuards(AuthGuard)
  updateUser(@Param('id') id: string, @Body() user: Users) {
    return this.userService.updateUser(id, user);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}

