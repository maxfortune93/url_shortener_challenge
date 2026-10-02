import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Redirect,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UrlsService } from './urls.service';

@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get(':slug')
  @Redirect()
  async redirect(@Param('slug') slug: string, @Req() req: Request) {
    const url = await this.urlsService.resolveForRedirect(slug);

    await this.urlsService.registerClick(url.id, {
      referrer: (req.headers.referer as string) ?? null,
      userAgent: req.headers['user-agent'] ?? null,
    });

    return { url: url.originalUrl, statusCode: HttpStatus.FOUND };
  }
}
