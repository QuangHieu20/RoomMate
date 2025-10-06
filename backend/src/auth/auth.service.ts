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
import * as process from 'node:process';

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
      fullName: user.fullName || user.email.split('@')[0], // Use fullName or fallback to email prefix
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
  generateToken(user: UserDto): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  // Generate Access Token (short-lived)
  generateAccessToken(user: UserDto): string {
    const payload = {
      sub: user.id,
      email: user.email,
      type: 'access',
    };
    return this.jwtService.sign(payload, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  // Generate Refresh Token (long-lived)
  generateRefreshToken(user: UserDto): string {
    const payload = {
      sub: user.id,
      email: user.email,
      type: 'refresh',
    };
    return this.jwtService.sign(payload, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: UserDto; accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(email, password);
    const userDto = this.toUserDto(user);
    const accessToken = this.generateAccessToken(userDto);
    const refreshToken = this.generateRefreshToken(userDto);

    return {
      user: userDto,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async register(createUserDto: CreateUser) {
    const email = createUserDto.email.toLowerCase().trim();
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
    const accessToken = this.generateToken(userDto);
    const refreshToken = this.generateRefreshToken(userDto);

    return {
      user: userDto,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  // Refresh Access Token using Refresh Token
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);

      // Check if it's a refresh token
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Get user data
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const userDto = this.toUserDto(user);
      const newAccessToken = this.generateAccessToken(userDto);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
