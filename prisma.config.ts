import { definePrismaConfig } from '@prisma/config';

export default definePrismaConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});