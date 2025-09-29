import { Body, Controller, Post, Get, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '@/auth/auth.service';
import { LoginDto } from '@/auth/dto/login.dto/login.dto';
import { LoginResponseDto } from '@/auth/dto/login-response.dto/login-response.dto';
import { RegisterResponseDto } from '@/auth/dto/register-response.dto/register-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(dto.email, dto.password);
    const userDto = this.authService.toUserDto(user);
    const loginResponse = this.authService.login(userDto);

    // Set HttpOnly cookie
    res.cookie('access_token', loginResponse.access_token, {
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: 'lax', // Back to 'lax' for same-origin
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
      // Remove domain to let browser handle it
    });

    return loginResponse;
  }

  @Post('register')
  async register(
    @Body() dto: RegisterResponseDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const registerResponse = await this.authService.register(dto);

    // Set HttpOnly cookie
    res.cookie('access_token', registerResponse.access_token, {
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: 'lax', // Change from 'strict' to 'lax' for development
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    return registerResponse;
  }

  // New endpoints for HttpOnly cookie management
  @Post('set-token')
  async setToken(
    @Body() body: { access_token: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('access_token', body.access_token, {
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: 'lax', // Change from 'strict' to 'lax' for development
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    return { success: true };
  }

  @Get('get-token')
  async getToken(@Req() req: Request) {
    console.log('=== GET TOKEN DEBUG ===');
    console.log('Cookies received:', req.cookies);
    console.log('Cookie header:', req.headers.cookie);
    console.log('All headers:', req.headers);

    const token = req.cookies?.access_token;
    console.log('Token extracted:', token);
    console.log('=== END DEBUG ===');

    return { access_token: token || null };
  }

  @Post('clear-token')
  async clearToken(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: 'lax', // Change from 'strict' to 'lax' for development
      path: '/',
    });

    return { success: true };
  }
}
