import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { Role } from 'src/global/enum/role.enum';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization/authorization.guard';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Controller('api/user-quiz')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':id/can-do')
  @Roles(Role.user)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  canDo(@Param('id') id: string, @Req() { user }) {
    return this.userService.canDo(+id, user);
  }

  @Post(':id')
  @Roles(Role.user)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  doQuiz(
    @Param('id') id: string,
    @Req() { user },
    @Body() createQuizDto: CreateQuizDto,
  ) {
    return this.userService.doQuiz(+id, user, createQuizDto);
  }

  @Get()
  @Roles(Role.user)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('key') key: string = '',
    @Req() { user },
  ) {
    return this.userService.findAll(user, page, pageSize, key);
  }

  @Get(':id')
  @Roles(Role.user)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  findOne(@Param('id') id: string, @Req() { user }) {
    return this.userService.findOne(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
