import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RedirectController } from './redirect.controller';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

@Module({
  imports: [AuthModule],
  controllers: [UrlsController, RedirectController],
  providers: [UrlsService],
})
export class UrlsModule {}
