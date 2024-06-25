import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { Role } from 'src/global/enum/role.enum';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization/authorization.guard';
import { AssignQuizDto } from './dto/assign-quiz.dto';

@Controller('api/quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  create(@Body() createQuizDto: CreateQuizDto, @Req() { user }) {
    return this.quizService.create(createQuizDto, user);
  }

  @Get()
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('key') key: string = '',
    @Req() { user },
  ) {
    return this.quizService.findAll(user, page, pageSize, key);
  }

  @Get(':id/get-result')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  findResult(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('key') key: string = '',
    @Req() { user },
    @Param('id') id: string,
  ) {
    return this.quizService.findResult(user, page, pageSize, key, +id);
  }

  @Get(':id/get-result-each-user')
  @Roles(Role.user)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  findResultEachUser(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Req() { user },
    @Param('id') id: string,
  ) {
    return this.quizService.findResultEachUser(user, page, pageSize, +id);
  }

  @Get(':id')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  findOne(@Param('id') id: string, @Req() { user }) {
    return this.quizService.findOne(+id, user);
  }

  @Get('get/get-dashboard/data')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  getDashboard() {
    return this.quizService.getDashboard();
  }

  @Patch(':id')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  update(@Param('id') id: string, @Req() { user }) {
    return this.quizService.update(+id, user);
  }

  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  remove(@Param('id') id: string, @Req() { user }) {
    return this.quizService.remove(+id, user);
  }

  @Post('/assign/:id')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  assign(
    @Body() assignDto: AssignQuizDto,
    @Param('id') id: string,
    @Req() { user },
  ) {
    return this.quizService.assign(+id, user, assignDto);
  }
}
