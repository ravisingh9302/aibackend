import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createDbConnection = async () => {
  await prisma.$connect();
};

export default prisma;
