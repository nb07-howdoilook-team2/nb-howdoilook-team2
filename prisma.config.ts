<<<<<<< HEAD
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
=======
import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    db: {
      url: process.env.DATABASE_URL!, 
    },
>>>>>>> 36979daa1000a9a18019eaa584148840d684e177
  },
});