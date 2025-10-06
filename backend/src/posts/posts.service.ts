import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Post } from '@generated/prisma';
import { CreatePostByUserIdDto } from '@/posts/dto/create-post-by-user-id.dto/create-post-by-user-id.dto';
import { PostStatus } from '@/common/types/enums';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { Express } from 'express';

@Injectable()
export class PostsService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'posts');

  constructor(private readonly prismaService: PrismaService) {
    // Tạo thư mục upload nếu chưa có
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private async saveUploadedFile(
    file: any,
    postId: string,
  ): Promise<{ filePath: string; mediaType: string }> {
    // Determine file extension and media type
    let extension: string;
    let mediaType: string;

    if (file.mimetype.startsWith('image/')) {
      extension = file.mimetype.split('/')[1];
      mediaType = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      extension = file.mimetype.split('/')[1];
      mediaType = 'video';
    } else {
      throw new Error('Unsupported media type');
    }

    // Generate unique filename
    const filename = `${randomUUID()}.${extension}`;
    const filePath = path.join(this.uploadDir, postId, filename);

    // Create post directory if not exists
    const postDir = path.dirname(filePath);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }

    // Save file
    fs.writeFileSync(filePath, file.buffer);

    // Return URL path for frontend access
    const relativePath = path.relative(process.cwd(), filePath);
    const urlPath = relativePath.replace(/\\/g, '/'); // Convert Windows path to URL format
    return { filePath: urlPath, mediaType };
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    return this.prismaService.post.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        media: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async createPostByUserService(
    userId: string,
    dto: CreatePostByUserIdDto,
    mediaFiles?: { mediaFiles?: Express.Multer.File[] },
  ): Promise<Post> {
    return this.prismaService.$transaction(async (prisma) => {
      // Tạo bài viết mới
      const newPost = await prisma.post.create({
        data: {
          userId,
          type: dto.type,
          title: dto.title,
          description: dto.description,
          price: dto.price,
          priceType: dto.priceType || 'monthly',
          area: dto.area,
          address: dto.address,
          locationId: dto.locationId,
          latitude: dto.latitude,
          longitude: dto.longitude,
          roomType: dto.roomType,
          genderRequirement: dto.genderRequirement || 'any',
          maxOccupants: dto.maxOccupants || 1,
          availableFrom: dto.availableFrom ? new Date(dto.availableFrom) : null,
          contactName: dto.contactName,
          contactPhone: dto.contactPhone,
          status: PostStatus.PENDING, // Mặc định là draft
        },
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      });
      const fileList = mediaFiles?.mediaFiles;
      // Xử lý media files nếu có
      // Tối ưu: Không query trong map, chỉ lưu file rồi bulk insert 1 lần
      if (fileList && fileList.length > 0) {
        // Lưu file và chuẩn bị data cho bulk insert
        const mediaData: Array<{
          postId: string;
          mediaUrl: string;
          mediaType: string;
          sortOrder: number;
          altText: string;
        }> = [];

        for (let index = 0; index < fileList.length; index++) {
          const file = fileList[index];
          const { filePath, mediaType } = await this.saveUploadedFile(
            file,
            newPost.id,
          );
          mediaData.push({
            postId: newPost.id,
            mediaUrl: filePath,
            mediaType,
            sortOrder: index,
            altText: `${mediaType} ${index + 1}`,
          });
        }

        if (mediaData.length > 0) {
          await prisma.postMedia.createMany({
            data: mediaData,
          });
        }
      }

      // Trả về post với media information
      const postWithMedia = await prisma.post.findUnique({
        where: { id: newPost.id },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
          media: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });

      if (!postWithMedia) {
        throw new Error('Post not found after creation');
      }

      return postWithMedia;
    });
  }
}
