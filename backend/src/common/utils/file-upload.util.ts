import { BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';

/**
 * Lưu các file từ FormData vào thư mục và trả về thông tin file
 *
 * @param files - Mảng các file từ Multer middleware
 * @param uploadDir - Đường dẫn thư mục để lưu file (VD: 'uploads')
 * @param baseUrl - Base URL để tạo đường dẫn truy cập file (VD: '/uploads')
 * @returns Promise trả về mảng object chứa filePath và mediaType
 *
 * @example
 * ```
 * const files = req.files as Express.Multer.File[];
 * const result = await saveFilesFromFormData(files, 'uploads', '/uploads');
 * // result: [{ filePath: '/uploads/uuid.jpg', mediaType: 'image' }]
 * ```
 *
 * @throws {BadRequestException} Khi không thể tạo thư mục hoặc lưu file
 */
export async function saveFilesFromFormData(
  files: Express.Multer.File[],
  uploadDir: string,
  baseUrl: string,
): Promise<{ filePath: string; mediaType: string }[]> {
  // Kiểm tra và tạo thư mục nếu chưa tồn tại
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    throw new BadRequestException('Không thể tạo thư mục lưu trữ: ' + error);
  }

  // Xử lý từng file
  const results = await Promise.all(
    files.map(async (file) => {
      // Xác định mediaType
      const mediaType = file.mimetype.startsWith('image/')
        ? 'image'
        : file.mimetype.startsWith('video/')
          ? 'video'
          : 'unknown';

      // Tạo tên file duy nhất với UUID để tránh trùng
      const fileExtension = extname(file.originalname);
      const fileName = `${randomUUID()}${fileExtension}`;
      const filePath = join(uploadDir, fileName);

      // Lưu file vào thư mục
      try {
        await fs.writeFile(filePath, file.buffer);
      } catch (error) {
        throw new BadRequestException(
          `Không thể lưu file ${file.originalname} : ${error}`,
        );
      }

      // Tạo URL cho file
      const urlPath = `${baseUrl}/${fileName}`;

      return { filePath: urlPath, mediaType };
    }),
  );

  return results;
}
