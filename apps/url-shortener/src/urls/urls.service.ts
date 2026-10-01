import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { customAlphabet } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';

const SLUG_ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SLUG_LENGTH = 7;
const MAX_SLUG_ATTEMPTS = 5;
const RESERVED_SLUGS = new Set([
  'api',
  'urls',
  'auth',
  'health',
  'favicon.ico',
  'robots.txt',
]);

const generateSlug = customAlphabet(SLUG_ALPHABET, SLUG_LENGTH);

@Injectable()
export class UrlsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateUrlDto, userId: string | null) {
    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    if (expiresAt && expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException('expiresAt must be in the future');
    }

    const slug = dto.slug
      ? await this.reserveCustomSlug(dto.slug)
      : await this.reserveRandomSlug();

    const url = await this.prisma.url.create({
      data: {
        slug,
        originalUrl: dto.originalUrl,
        userId: userId ?? undefined,
        expiresAt: expiresAt ?? undefined,
      },
    });

    return this.toResponse(url);
  }

  async listByUser(userId: string) {
    const urls = await this.prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return urls.map((url) => this.toResponse(url));
  }

  async getStats(id: string, userId: string) {
    const url = await this.prisma.url.findUnique({ where: { id } });
    if (!url) {
      throw new NotFoundException('Url not found');
    }
    if (url.userId !== userId) {
      throw new ForbiddenException('You do not own this url');
    }

    const recentClicks = await this.prisma.click.findMany({
      where: { urlId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { createdAt: true, referrer: true, userAgent: true },
    });

    return { ...this.toResponse(url), recentClicks };
  }

  async remove(id: string, userId: string) {
    const url = await this.prisma.url.findUnique({ where: { id } });
    if (!url) {
      throw new NotFoundException('Url not found');
    }
    if (url.userId !== userId) {
      throw new ForbiddenException('You do not own this url');
    }
    await this.prisma.url.delete({ where: { id } });
  }

  async resolveForRedirect(slug: string) {
    const url = await this.prisma.url.findUnique({ where: { slug } });
    if (!url) {
      throw new NotFoundException('Short url not found');
    }
    if (url.expiresAt && url.expiresAt.getTime() <= Date.now()) {
      throw new GoneException('This short url has expired');
    }
    return url;
  }

  async registerClick(
    urlId: string,
    meta: { referrer: string | null; userAgent: string | null },
  ) {
    await this.prisma.$transaction([
      this.prisma.url.update({
        where: { id: urlId },
        data: { clicksCount: { increment: 1 } },
      }),
      this.prisma.click.create({
        data: { urlId, referrer: meta.referrer, userAgent: meta.userAgent },
      }),
    ]);
  }

  private async reserveCustomSlug(requested: string) {
    const slug = requested.trim();
    if (RESERVED_SLUGS.has(slug.toLowerCase())) {
      throw new ConflictException(
        'This alias is reserved, please choose another one',
      );
    }
    const existing = await this.prisma.url.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException('This alias is already taken');
    }
    return slug;
  }

  private async reserveRandomSlug() {
    for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
      const slug = generateSlug();
      const existing = await this.prisma.url.findUnique({ where: { slug } });
      if (!existing) {
        return slug;
      }
    }
    throw new ConflictException(
      'Could not generate a unique short url, please try again',
    );
  }

  private toResponse(url: {
    id: string;
    slug: string;
    originalUrl: string;
    clicksCount: number;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const baseUrl = this.configService.get<string>(
      'BASE_URL',
      'http://localhost:3001',
    );
    return {
      id: url.id,
      slug: url.slug,
      originalUrl: url.originalUrl,
      shortUrl: `${baseUrl.replace(/\/$/, '')}/${url.slug}`,
      clicksCount: url.clicksCount,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }
}
