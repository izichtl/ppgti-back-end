import { DataSource, DataSourceOptions } from 'typeorm';
import { DB_CONNECTION_STRING } from '../config';

const parameters: DataSourceOptions = {
  type: 'postgres',
  url: DB_CONNECTION_STRING,
  synchronize: false,
  logging: true,
  entities: [],
  subscribers: [],
  migrationsTableName: 'typeorm_migrations',
};

const AppDataSource = new DataSource(parameters);

export default AppDataSource;
