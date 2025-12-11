import 'dotenv/config';

export default {
  datasources: {
    db: {
      adapter: 'postgresql',
      url: process.env.DATABASE_URL,
    },
  },
};