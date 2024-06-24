import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createQuizDto: CreateQuizDto, user: User) {
    const { name, description, questions, passScore, totalScore } =
      createQuizDto;

    return this.prisma.$transaction(async (prisma) => {
      // Create the quiz
      const quiz = await prisma.quiz.create({
        data: {
          name,
          description,
          createdBy: user.id,
          passScore: +passScore,
          totalScore: +totalScore,
        },
      });

      // Create questions, options, and answers
      for (const questionDto of questions) {
        const { name, type, score, options, answer } = questionDto;

        const question = await prisma.question.create({
          data: {
            name,
            type,
            score,
            quizId: quiz.id, // Ensure this is correctly assigned
          },
        });

        for (const optionDto of options) {
          await prisma.option.create({
            data: {
              letter: optionDto.letter,
              name: optionDto.name,
              questionId: question.id,
            },
          });
        }

        for (const answerDto of answer) {
          await prisma.answer.create({
            data: {
              letter: answerDto.letter,
              questionId: question.id,
            },
          });
        }
      }

      return quiz;
    });
  }

  async findAll(
    user: User,
    page: number = 1,
    pageSize: number = 10,
    key: string = '',
  ) {
    try {
      // Calculate the offset for pagination
      const skip = (page - 1) * pageSize;

      // Build the search criteria conditionally
      const where: any = {
        createdBy: user.id,
      };

      if (key) {
        where.OR = [{ name: { contains: key, mode: 'insensitive' } }];
      }

      // Get the total count of data matching the criteria
      const totalCount = await this.prisma.quiz.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / pageSize);

      // Get the data with pagination and search criteria
      const data = await this.prisma.quiz.findMany({
        where,
        skip,
        take: +pageSize,
        orderBy: {
          id: 'desc',
        },
      });

      // Return the response with pagination details
      return {
        data,
        totalCount: +totalCount,
        totalPages: +totalPages,
        currentPage: +page,
        pageSize: +pageSize,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number, user: User) {
    try {
      const quiz = await this.prisma.quiz.findFirst({
        where: {
          id,
          createdBy: user.id,
        },
        include: {
          questions: {
            include: {
              answer: true,
              option: true,
            },
          },
        },
      });
      if (!quiz) {
        throw new NotFoundException();
      }
      return quiz;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, user: User) {
    try {
      let status: boolean = true;
      const updatedQuiz = await this.findOne(id, user);
      if (updatedQuiz.status) {
        status = false;
      }
      await this.prisma.quiz.update({ where: { id }, data: { status } });
      return {
        message: 'Updated success',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, user: User) {
    try {
      await this.findOne(id, user);
      await this.prisma.quiz.delete({ where: { id, createdBy: user.id } });
      return {
        message: 'Deleted success',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async assign(id: number, assigner: User, users: any) {
    try {
      await this.prisma.assign.deleteMany({ where: { quizId: id } });
      return this.prisma.$transaction(async (prisma) => {
        for (const user of users.users) {
          const isAssigned = await prisma.assign.findUnique({
            where: {
              quizId_userId: {
                quizId: id,
                userId: user.id,
              },
            },
          });
          if (isAssigned) {
            throw new BadRequestException(`user id ${user.id} was assiged`);
          }
          const isUser = await prisma.user.findUnique({
            where: { id: user.id },
          });
          if (!isUser) {
            throw new NotFoundException(`user Id ${user.id} not found`);
          }
          await prisma.assign.create({
            data: {
              quizId: id,
              userId: user.id,
              assigner: assigner.name,
            },
          });
        }

        return {
          message: 'Assigned success',
          statusCode: HttpStatus.CREATED,
        };
      });
    } catch (error) {
      //check if duplicate
      throw error;
    }
  }

  async findResult(
    user: User,
    page: number = 1,
    pageSize: number = 10,
    key: string = '',
    id: number,
  ) {
    try {
      // Calculate the offset for pagination
      const skip = (page - 1) * pageSize;

      // Build the search criteria conditionally
      const where: any = {
        quizId: id,
      };

      if (key) {
        where.OR = [{ name: { contains: key, mode: 'insensitive' } }];
      }

      // Get the total count of data matching the criteria
      const totalCount = await this.prisma.result.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / pageSize);

      // Get the data with pagination and search criteria
      const data = await this.prisma.result.findMany({
        where,
        include: {
          quiz: true,
          user: {
            select: {
              name: true,
            },
          },
        },
        skip,
        take: +pageSize,
        orderBy: {
          quizId: 'desc',
        },
      });

      // Return the response with pagination details
      return {
        data,
        totalCount: +totalCount,
        totalPages: +totalPages,
        currentPage: +page,
        pageSize: +pageSize,
      };
    } catch (error) {
      throw error;
    }
  }

  async getDashboard() {
    try {
      const totalAdmins = await this.prisma.user.count({
        where: { roleId: 1 },
      });
      const totalUsers = await this.prisma.user.count({
        where: { roleId: 2 },
      });
      const totalQuizzes = await this.prisma.quiz.count();
      const totalResults = await this.prisma.result.count();

      return {
        totalAdmins,
        totalUsers,
        totalQuizzes,
        totalResults,
      };
    } catch (error) {
      throw error;
    }
  }
}
