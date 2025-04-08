import dotenv from 'dotenv';

import app from './app';
import { connectToDatabase } from './infrastructure/config/database.config';

async function main() {
  dotenv.config();

  await connectToDatabase(process.env.MONGODB_URI || 'mongodb://localhost:27017/radar');

  const PORT = process.env.PORT || '3000';

  app(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
