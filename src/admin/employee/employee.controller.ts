import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { Role } from 'src/global/enum/role.enum';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization/authorization.guard';
import { UpdateEmployeeDTO } from './dto/update-employee.dto';
import { CreateEmployeeDTO } from './dto/create-employee.dto';

@Controller('api/account')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  create(@Body() createEmployeeDTO: CreateEmployeeDTO) {
    return this.employeeService.create(createEmployeeDTO);
  }

  @Post('create-admin')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  createAdmin(@Body() createEmployeeDTO: CreateEmployeeDTO) {
    return this.employeeService.createAdmin(createEmployeeDTO);
  }

  @Get()
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('key') key: string = '',
  ) {
    return this.employeeService.findAll(page, pageSize, key);
  }

  @Get('get/add-admin')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  findAllAdmin(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('key') key: string = '',
  ) {
    return this.employeeService.findAllAdmin(page, pageSize, key);
  }
  @Get('get/every/:id')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  findEvery(@Param('id') id: number) {
    return this.employeeService.findEvery(id);
  }

  @Get('get/selected/users/:id')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  findSelected(@Param('id') id: number) {
    return this.employeeService.findSelected(id);
  }

  @Get(':id')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  findOne(@Param('id') id: number) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  update(
    @Param('id') id: number,
    @Body() updateEmployeeDTO: UpdateEmployeeDTO,
  ) {
    return this.employeeService.update(+id, updateEmployeeDTO);
  }

  @Patch(':id/reset-password')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  resetPassword(@Param('id') id: number) {
    return this.employeeService.resetPassword(+id);
  }

  @Delete(':id/delete-user')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  deleteUser(@Param('id') id: number) {
    return this.employeeService.deleteUser(+id);
  }

  @Patch(':id/toggle-active')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  toggleActive(@Param('id') id: number, @Req() { user }) {
    return this.employeeService.toggleActive(+id, user);
  }

  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  remove(@Param('id') id: number) {
    return this.employeeService.remove(+id);
  }
}
