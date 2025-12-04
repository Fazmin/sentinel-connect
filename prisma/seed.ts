import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

// Get database file path - matches what prisma.config.ts uses
const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
const dbPath = dbUrl.replace('file:', '').replace('./', '');
// Database is in the root of the project, not in prisma folder
const absoluteDbPath = path.join(process.cwd(), dbPath);

console.log('Database path:', absoluteDbPath);

// Create adapter with URL config
const adapter = new PrismaBetterSqlite3({ url: absoluteDbPath });

// Create Prisma client with adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create default admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sentinelconnect.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Administrator',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      },
    });

    console.log(`Created admin user: ${admin.email}`);
  } else {
    console.log(`Admin user already exists: ${existingAdmin.email}`);
  }

  // Create default settings
  const defaultSettings = [
    { key: 'app_name', value: 'SentinelConnect', description: 'Application name' },
    { key: 'timezone', value: 'UTC', description: 'Default timezone' },
    { key: 'default_output_path', value: './output', description: 'Default output path for sync files' },
    { key: 'default_row_limit', value: '100000', description: 'Default row limit per table' },
    { key: 'audit_retention_days', value: '90', description: 'Audit log retention in days' },
    { key: 'file_retention_days', value: '30', description: 'Sync file retention in days' },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('Created default settings');

  // Create sample data source (for demo purposes)
  const demoDataSource = await prisma.dataSource.upsert({
    where: { id: 'demo-source' },
    update: {},
    create: {
      id: 'demo-source',
      name: 'Demo PostgreSQL',
      description: 'Sample PostgreSQL database for demonstration',
      dbType: 'postgresql',
      host: 'localhost',
      port: 5432,
      database: 'demo_db',
      username: 'demo_user',
      password: 'demo_password', // In production, this would be encrypted
      sslEnabled: false,
      isActive: true,
      connectionStatus: 'untested',
    },
  });

  console.log(`Created demo data source: ${demoDataSource.name}`);

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
