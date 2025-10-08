import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { join } from 'path';
import multer from 'multer';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { CheckPhoneExistsDto } from './dto/check-phone-exists.dto';
import { UpdateUser } from '@/users/dto/update-dto/update-user';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { saveFilesFromFormData } from '@common/utils/file-upload.util';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(): string {
    return this.usersService.getUsers();
  }

  @Post('check-exists-phone')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  checkExistsPhone(@Body() request: CheckPhoneExistsDto): Promise<boolean> {
    return this.usersService.checkExistsPhoneService(request);
  }

  @Post('update-user-info')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'coverPhoto', maxCount: 1 }], {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        // Chấp nhận ảnh và video
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Chỉ chấp nhận ảnh (jpg/png/jpeg)'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @UsePipes(new ValidationPipe({ transform: false }))
  @HttpCode(HttpStatus.OK)
  async updateUserInfo(
    @Body() request: UpdateUser,
    @Request() req: any,
    @UploadedFiles() file: { coverPhoto?: Express.Multer.File[] },
  ) {
    const userId = req.user?.userId as string;

    // Save Image -> get Link
    let coverPhotoInfo: { filePath: string; mediaType: string } | null = null;
    if (file.coverPhoto && file.coverPhoto.length > 0) {
      const uploadDir = join(process.cwd(), 'uploads/avatar');
      const baseUrl = '/uploads/avatar';
      const savedFiles = await saveFilesFromFormData(
        file.coverPhoto,
        uploadDir,
        baseUrl,
      );
      coverPhotoInfo = savedFiles[0]; // maxCount: 1
    }
    return this.usersService.updateUserInfoService(
      userId,
      request,
      coverPhotoInfo,
    );
  }
}
