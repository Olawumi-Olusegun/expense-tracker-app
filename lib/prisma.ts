import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismaDb = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prismaDb

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prismaDb