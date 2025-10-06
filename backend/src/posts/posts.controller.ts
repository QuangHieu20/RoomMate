import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import multer from 'multer';
import { PostsService } from '@/posts/posts.service';
import { Post as PostModel } from '@generated/prisma';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreatePostByUserIdDto } from '@/posts/dto/create-post-by-user-id.dto/create-post-by-user-id.dto';
import { join } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import * as path from 'node:path';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Post('user')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getPostByUserId(@Request() req: any): Promise<PostModel[]> {
    const userId = req.user?.userId;
    return this.postService.getPostsByUserId(userId as string);
  }

  @Post('test-upload')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 5 }], {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 8 * 1024 * 1024, // 8MB limit
      },
    }),
  )
  uploadPost(@UploadedFiles() files: { files?: Express.Multer.File[] }) {
    const fileList = files?.files;

    if (!fileList || !fileList.length) {
      throw new Error('Không có file upload');
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'posts');
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

    for (const file of fileList) {
      const filePath = path.join(uploadDir, file.originalname);
      writeFileSync(filePath, file.buffer);
    }

    return { message: 'Upload nhiều file thành công', count: fileList.length };
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'mediaFiles', maxCount: 5 }], {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 8 * 1024 * 1024, // 8MB limit
      },
      fileFilter: (req, file, cb) => {
        // Chấp nhận ảnh và video
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'video/mp4',
          'video/quicktime', // MOV
        ];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Chỉ chấp nhận ảnh (jpg/png/webp) hoặc video (mp4/mov)',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @UsePipes(new ValidationPipe({ transform: false }))
  @HttpCode(HttpStatus.CREATED)
  async createPostByUser(
    @Request() req: any,
    @Body() dto: CreatePostByUserIdDto,
    @UploadedFiles() files: { mediaFiles?: Express.Multer.File[] },
  ): Promise<PostModel> {

    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID not found in JWT token');
    }

    return this.postService.createPostByUserService(userId, dto, files);
  }
}
