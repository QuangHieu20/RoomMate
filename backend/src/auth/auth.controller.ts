import { Body, Controller, Post, Get, Res, Req, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '@/auth/auth.service';
import { LoginDto } from '@/auth/dto/login.dto/login.dto';
import { AuthResponseDto } from '@/auth/dto/auth-response.dto/auth-response.dto';
import { RegisterResponseDto } from '@/auth/dto/register-response.dto/register-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { user, accessToken, refreshToken } = await this.authService.login(
      dto.email,
      dto.password,
    );

    // Set Access Token cookie (15 minutes)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 1000, // 15 minutes
      path: '/',
    });

    // Set Refresh Token cookie (7 days)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    // Return only user data
    return {
      user,
    };
  }

  @Post('register')
  async register(
    @Body() dto: RegisterResponseDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { user } = await this.authService.register(dto);

    // Set HttpOnly cookie
    res.cookie('access_token', {
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: 'lax', // Change from 'strict' to 'lax' for development
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
    });

    // Return only user data, no token in response
    return {
      user: user,
    };
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
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
    });

    return { success: true };
  }

  @Get('get-token')
  async getToken(@Req() req: Request) {
    const token = req.cookies?.access_token;

    return { access_token: token || null };
  }

  @Post('clear-token')
  async clearToken(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return { success: true };
  }

  // Refresh Access Token endpoint
  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { accessToken } =
      await this.authService.refreshAccessToken(refreshToken);

    // Set new access token cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
    });

    return { success: true };
  }
}
