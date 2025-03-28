// src/config/database.config.ts
import { registerAs } from '@nestjs/config';
import { Account, ToDo, User } from 'src/entities';

export const databaseConfig = registerAs('database', () => ({
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  postgres: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT as string, 10) || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'your-db-name',
    entities: [Account, ToDo, User],
    synchronize: process.env.NODE_ENV !== 'production',
  },
}));