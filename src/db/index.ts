import { DataSource, DataSourceOptions } from 'typeorm';
import { DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } from '../config';
import { createClient } from '@supabase/supabase-js';

const parameters: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  logging: true,
  entities: [],
  subscribers: [],
  migrationsTableName: 'typeorm_migrations',
};

const AppDataSource = new DataSource(parameters);

export default AppDataSource;

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
