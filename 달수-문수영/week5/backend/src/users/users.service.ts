import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...data } = createUserDto;
    const hashedPassword = await hash(password);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOne(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async updateHashedRefreshToken(userId: number, hashedRT: string | null) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: hashedRT,
      },
    });
  }

  async getMyInfo(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }

    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(userId: number) {
    // 사용자가 존재하는지 확인
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 트랜잭션을 사용해 관련 데이터(좋아요, 댓글, 게시글)를 삭제 후, 최종적으로 사용자를 삭제합니다.
    return await this.prisma.$transaction(async (prisma) => {
      // 해당 사용자의 좋아요 삭제
      await prisma.like.deleteMany({ where: { userId } });
      // 해당 사용자의 댓글 삭제
      await prisma.comment.deleteMany({ where: { authorId: userId } });
      // 해당 사용자가 작성한 게시글 삭제
      await prisma.lp.deleteMany({ where: { authorId: userId } });
      // 최종적으로 사용자 삭제
      return await prisma.user.delete({ where: { id: userId } });
    });
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });

    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
