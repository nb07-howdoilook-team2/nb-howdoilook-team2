// import "dotenv/config";
// import pgPkg from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";
// const { PrismaClient } = await import("@prisma/client");

// const { Pool } = pgPkg;

// const pool = new Pool({
//    connectionString: process.env.DATABASE_URL,
// });

// const adapter = new PrismaPg(pool);

// const prisma = new PrismaClient({ adapter });

// export default prisma;
import "dotenv/config";
import pgPkg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
// 이 부분을 동적 import로 수정합니다.
const { PrismaClient } = await import("@prisma/client");

const { Pool } = pgPkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;


