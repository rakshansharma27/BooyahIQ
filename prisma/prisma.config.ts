import { Prisma } from '@prisma/client';

const schema = `
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  generator client {
    provider = "prisma-client-js"
  }
  model User {
    id    Int    @id @default(autoincrement())
    email String @unique
  }
`;

const prisma = new Prisma(schema);

export default prisma;
