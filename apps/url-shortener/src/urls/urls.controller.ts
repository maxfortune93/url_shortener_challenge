import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlsService } from './urls.service';

@Controller('api/urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  create(@Body() dto: CreateUrlDto, @CurrentUser() user?: { userId: string }) {
    return this.urlsService.create(dto, user?.userId ?? null);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@CurrentUser() user: { userId: string }) {
    return this.urlsService.listByUser(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/stats')
  stats(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    return this.urlsService.getStats(id, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    return this.urlsService.remove(id, user.userId);
  }
}
