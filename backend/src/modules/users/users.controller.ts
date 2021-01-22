import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersCreateDto } from 'src/modules/users/dto/users.create.dto';
import { UsersLoginDto } from 'src/modules/users/dto/users.login.dto';
import { UsersLookupDto } from 'src/modules/users/dto/users.lookup.dto';
import { UsersUpdateEmailDto } from 'src/modules/users/dto/users.update-email.dto';
import { UsersUpdatePasswordDto } from 'src/modules/users/dto/users.update-password.dto';
import { UsersUpdateProfileDto } from 'src/modules/users/dto/users.update-profile.dto';

import { User } from 'src/modules/users/entities/user.entity';

import { UsersService } from 'src/modules/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async lookup(@Query() dto: UsersLookupDto): Promise<User[]> {
    return this.usersService.lookup(dto);
  }

  @Get('/:id')
  async findOneById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Get('/@me')
  @UseGuards(AuthGuard('user-auth'))
  async getCurrentUser(@Req() req: any): Promise<User> {
    return req.user;
  }

  @Post('/')
  async create(
    @Body() dto: UsersCreateDto,
  ): Promise<{
    user: User;
    token: string;
  }> {
    return this.usersService.create(dto);
  }

  @Patch('/profile')
  @UseGuards(AuthGuard('user-auth'))
  async updateProfile(@Body() dto: UsersUpdateProfileDto, @Req() req: any): Promise<User> {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Patch('/email')
  @UseGuards(AuthGuard('user-auth'))
  async updateEmail(@Body() dto: UsersUpdateEmailDto, @Req() req: any): Promise<User> {
    return this.usersService.updateEmail(req.user.id, dto);
  }

  @Patch('/password')
  @UseGuards(AuthGuard('user-auth'))
  async updatePassword(@Body() dto: UsersUpdatePasswordDto, @Req() req: any): Promise<void> {
    return this.usersService.updatePassword(req.user.id, dto);
  }

  @Delete('/')
  @UseGuards(AuthGuard('user-auth'))
  async remove(@Req() req: any): Promise<void> {
    return this.usersService.remove(req.user.id);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() dto: UsersLoginDto): Promise<{ user: User; token: string }> {
    return this.usersService.login(dto);
  }
}
