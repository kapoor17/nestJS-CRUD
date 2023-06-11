import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private configSerive : ConfigService) {
    super({
      datasources: {
        db: {
          url: configSerive.get('DATABASE_URL'),
        },
      },
    });
  }
}
