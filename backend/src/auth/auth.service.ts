import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUser } from '@/users/dto/create-user/create-user';
import { LoginResponseDto } from '@/auth/dto/login-response.dto/login-response.dto';
import { UserDto } from './dto/user.dto';
import { User } from '@generated/prisma';

// Type for user data without passwordHash
type UserWithoutPassword = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async checkPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  // Convert User entity to UserDto
  toUserDto(user: UserWithoutPassword): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.fullName || user.email.split('@')[0], // Use fullName or fallback to email prefix
      avatar: user.avatar,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }

    const isMatch = await this.checkPassword(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
  login(user: UserDto): LoginResponseDto {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  async register(createUserDto: CreateUser) {
    const email = createUserDto.email.toLowerCase().trim();
    console.log(email);
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (existingEmail) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    const existingPhoneNumber = await this.prisma.user.findUnique({
      where: { phone: createUserDto.phone.trim() },
    });
    if (existingPhoneNumber) {
      throw new HttpException('Phone already exists', HttpStatus.BAD_REQUEST);
    }

    // Hash Password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    // 4. Create user
    const user = await this.prisma.user.create({
      data: {
        email: email,
        phone: createUserDto.phone,
        fullName: createUserDto.fullName,
        passwordHash: hashedPassword, // ← Lưu password đã hash
        avatar: createUserDto.avatar,
        role: 'user',
        status: 'inactive',
        emailVerifiedAt: new Date().toISOString(),
      },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        emailVerifiedAt: true,
      },
    });
    const userDto = this.toUserDto(user);
    return this.login(userDto);
  }
}
