import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtService } from './auth/jwt.service';
import { EmployeeModule } from './admin/employee/employee.module';
import { AdminModule } from './admin/admin/admin.module';
import { FileUploadModule } from './file/file-upload.module';
import { UserModule } from './admin/user/user.module';
import { QuizModule } from './admin/quiz/quiz.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    EmployeeModule,
    AdminModule,
    FileUploadModule,
    QuizModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtService],
})
export class AppModule {}
