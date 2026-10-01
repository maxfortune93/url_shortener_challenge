import {
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUrlDto {
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  originalUrl: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message: 'slug may only contain letters, numbers, hyphens and underscores',
  })
  slug?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
