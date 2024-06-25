import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async doQuiz(id: number, user: User, createQuizDto: CreateQuizDto) {
    try {
      // Step 1: Validate if the quiz exists and is assigned to the user
      const quiz = await this.prisma.quiz.findUnique({
        where: { id },
        include: { Assign: true },
      });

      if (!quiz) {
        throw new NotFoundException(`Quiz with id ${id} not found`);
      }

      const assignment = quiz.Assign.find(
        (assign) => assign.userId === user.id,
      );

      if (!assignment) {
        throw new BadRequestException(
          `Quiz is not assigned to user ${user.id}`,
        );
      }

      // Step 2: Initialize total score and dodata array
      let totalScore = 0;
      const dodata = [];

      // Step 3: Process each answer
      for (const answer of createQuizDto.answers) {
        // Step 4: Find the question details including correct answers
        const question = await this.prisma.question.findUnique({
          where: { id: answer.questionId },
          include: {
            answer: true,
          },
        });

        // Step 5: Check if question exists
        if (!question) {
          throw new BadRequestException(
            `Question with id ${answer.questionId} not found`,
          );
        }

        // Step 6: Check answer based on question type
        let questionScore = 0;
        if (question.type === 'SINGLE') {
          // Single choice question
          const correctAnswer = question.answer[0].letter.toLowerCase(); // Normalize case
          const userAnswer = answer.option[0]?.letter.toLowerCase(); // Normalize case

          if (correctAnswer === userAnswer) {
            questionScore = question.score;
            totalScore += questionScore;
          }
        } else if (question.type === 'MULTIPLE') {
          // Multiple choice question
          if (question.answer.length === answer.option.length) {
            const correctOptions = question.answer
              .map((ans) => ans.letter.toLowerCase())
              .sort();
            const selectedOptions = answer.option
              .map((opt) => opt.letter.toLowerCase())
              .sort();

            const allCorrect = correctOptions.every((opt) =>
              selectedOptions.includes(opt),
            );

            if (allCorrect) {
              questionScore = question.score;
              totalScore += questionScore;
            }
          }
        }

        // Optional: Store additional data if needed
        dodata.push({
          questionId: question.id,
          userAnswer: answer.option,
          score: questionScore,
        });
      }
      // Step 7: Save result to database
      const transformedData = dodata?.map((item) => {
        const userAnswers = item.userAnswer
          .map((answer) => answer.letter.toLowerCase())
          .join('');
        return `questionId:${item.questionId},userAnswer:[${userAnswers}]`;
      });
      const getPassScore = await this.prisma.quiz.findUnique({
        where: { id },
        select: { passScore: true },
      });
      const mark: boolean = totalScore >= getPassScore.passScore;
      await this.prisma.result.create({
        data: {
          quizId: quiz.id,
          userId: user.id,
          userAnswer: transformedData, // Save only the letters of options
          score: totalScore,
          isPass: mark,
        },
      });
      // step 8: Update assign status to false
      await this.prisma.assign.update({
        where: {
          // Using the custom type for the unique input
          quizId_userId: {
            quizId: id,
            userId: user.id,
          }, // Type assertion
        },
        data: {
          status: false,
        },
      });

      // Step 9: Return processed data and total score
      return { dodata, totalScore };
    } catch (error) {
      throw error; // Propagate any errors
    }
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
      // Build the search criteria conditionally
      const where: any = {
        userId: user.id,
        quiz: {
          status: true,
        },
      };

      if (key) {
        where.OR = [{ quiz: { name: { contains: key, mode: 'insensitive' } } }];
      }

      // Get the total count of data matching the criteria
      const totalCount = await this.prisma.assign.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / pageSize);

      // Get the data with pagination and search criteria
      const data = await this.prisma.assign.findMany({
        where,
        include: {
          quiz: true,
        },
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
      const quiz = await this.prisma.assign.findFirst({
        where: {
          quizId: id,
          userId: user.id,
        },
        include: {
          quiz: {
            include: {
              questions: {
                include: {
                  option: true,
                },
              },
            },
          },
        },
      });

      if (!quiz) {
        throw new NotFoundException('Quiz not found!');
      }

      return quiz;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} ${updateUserDto} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
