import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [UploadsController],
})
export class UploadsModule {}
