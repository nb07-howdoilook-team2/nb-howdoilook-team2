
import 'dotenv/config'; 
import { defineConfig } from "prisma/config"; 

const databaseUrl = process.env.DATABASE_URL as string; 

export default defineConfig({
  schema: "prisma/schema.prisma",

  
  datasource: {
    url: databaseUrl, 
  },

  migrations: {
    path: "prisma/migrations",
    seed: "node ./prisma/db/seed/seed.js",

  },
});