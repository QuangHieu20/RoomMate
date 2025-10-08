import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CheckPhoneExistsDto } from './dto/check-phone-exists.dto';
import { UpdateUser } from '@/users/dto/update-dto/update-user';
import { User } from '@generated/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getUsers(): string {
    return 'Users';
  }
  async checkExistsPhoneService(
    request: CheckPhoneExistsDto,
  ): Promise<boolean> {
    const existsPhone = await this.prisma.user.findUnique({
      where: {
        phone: request.phone,
      },
    });
    return !!existsPhone;
  }

  async updateUserInfoService(
    userId: string,
    request: UpdateUser,
    fileLink: { filePath: string; mediaType: string } | null,
  ) {
    const updateUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName: request.fullName,
        phone: request.phone,
        avatar: fileLink?.filePath,
      },
    });
    return {
      id: updateUser.id,
      email: updateUser.email,
      fullName: updateUser.fullName || updateUser.email.split('@')[0], // Use fullName or fallback to email prefix
      avatar: updateUser.avatar,
      phone: updateUser.phone,
    };
  }
}
