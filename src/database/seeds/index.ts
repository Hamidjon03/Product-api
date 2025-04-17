import { DataSource } from 'typeorm';
import { createAdminUser } from './admin.seed';
import { User } from '../../modules/auth/entities/user.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST as string,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  entities: [User],
  synchronize: false,
});

const runSeeds = async (dataSource: DataSource) => {
  try {
    await createAdminUser(dataSource);
    console.log('All seeds completed successfully');
  } catch (error) {
    console.error('Error running seeds:', error);
  } finally {
    await dataSource.destroy();
  }
};

dataSource
  .initialize()
  .then(async (ds) => {
    console.log('Data Source has been initialized!');
    await runSeeds(ds);
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
