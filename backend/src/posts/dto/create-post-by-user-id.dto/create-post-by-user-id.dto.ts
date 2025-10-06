import {
  IsEnum,
  IsOptional,
  IsString,
  IsInt,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import {
  PostType,
  PriceType,
  RoomType,
  GenderRequirement,
} from '@/common/types/enums';

export class CreatePostByUserIdDto {
  @IsEnum(PostType)
  type: PostType;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsEnum(PriceType)
  priceType?: PriceType;

  @IsOptional()
  @IsInt()
  @Min(1)
  area?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsInt()
  locationId?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsEnum(RoomType)
  roomType?: RoomType;

  @IsOptional()
  @IsEnum(GenderRequirement)
  genderRequirement?: GenderRequirement;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  maxOccupants?: number;

  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  // mediaFiles sẽ được xử lý riêng thông qua file upload
}
