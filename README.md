# SentinelConnect

**Secure Data Provisioning Service**

A secure intermediary service that connects to enterprise databases, extracts only approved tables and columns, and syncs them into a SQLite file for analysts, developers, or testers who need a lightweight, isolated dataset.

![SentinelConnect Dashboard](public/Sentical_db.png)

## Features

### Security First
- **Isolation**: Enterprise DB never communicates directly with end users
- **Least Privilege**: Connector uses read-only credentials
- **Data Masking**: Support for redaction, hashing, randomization, and tokenization
- **Encryption**: TLS for data in transit, optional encryption at rest

### Admin Console
- Web-based interface for configuration management
- Configure data sources with multiple database types support
- Select specific tables and columns to sync
- Set up data masking rules for sensitive fields
- Configure sync schedules (manual, hourly, daily, weekly, or cron)

### Sync Engine
- Full refresh or incremental sync modes
- Transactional integrity for consistent SQLite files
- Progress tracking and real-time status updates
- Automatic compression and encryption options

### Audit Logging
- Track every sync execution
- Log all configuration changes
- Monitor downloads and access
- Full audit trail for compliance

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **UI Components**: Shadcn UI, Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sentinel-connect
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

6. Login with default credentials:
   - Email: `admin@sentinelconnect.local`
   - Password: `admin123`

> **Important**: Change the default admin password immediately in production!

## Project Structure

```
sentinel-connect/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/                # Next.js app router pages
│   │   ├── api/            # API routes
│   │   ├── data-sources/   # Data source management
│   │   ├── sync-configs/   # Sync configuration
│   │   ├── jobs/           # Job monitoring
│   │   ├── audit-logs/     # Audit log viewer
│   │   └── settings/       # Application settings
│   ├── components/
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Shadcn UI components
│   ├── lib/
│   │   ├── api.ts          # API client functions
│   │   ├── db.ts           # Prisma client
│   │   ├── store.ts        # Zustand store
│   │   └── utils.ts        # Utility functions
│   └── types/
│       └── index.ts        # TypeScript definitions
└── output/                 # Sync output files (gitignored)
```

## Core Concepts

### Data Sources
Configure connections to enterprise databases (PostgreSQL, MySQL, SQL Server, Oracle). Each data source stores connection credentials securely and can be tested before use.

### Sync Configurations
Define what data to sync from a data source:
- Select specific tables and columns
- Apply row filters with WHERE clauses
- Configure data masking rules
- Set up sync schedules

### Sync Jobs
Track execution of sync configurations:
- View real-time progress
- Monitor rows and tables processed
- Download output files
- View error details for failed jobs

### Audit Logs
Comprehensive logging of all system activities:
- Configuration changes
- Sync executions
- Connection tests
- File downloads

## API Endpoints

### Data Sources
- `GET /api/data-sources` - List all data sources
- `POST /api/data-sources` - Create a new data source
- `GET /api/data-sources/:id` - Get data source details
- `PUT /api/data-sources/:id` - Update a data source
- `DELETE /api/data-sources/:id` - Delete a data source
- `GET /api/data-sources/:id/test` - Test connection
- `GET /api/data-sources/:id/tables` - Discover tables

### Sync Configurations
- `GET /api/sync-configs` - List all configurations
- `POST /api/sync-configs` - Create a new configuration
- `GET /api/sync-configs/:id` - Get configuration details
- `PUT /api/sync-configs/:id` - Update a configuration
- `DELETE /api/sync-configs/:id` - Delete a configuration
- `PUT /api/sync-configs/:id/tables` - Update table configs
- `POST /api/sync-configs/:id/run` - Trigger a sync

### Sync Jobs
- `GET /api/sync-jobs` - List all jobs
- `GET /api/sync-jobs/:id` - Get job details
- `POST /api/sync-jobs/:id/cancel` - Cancel a running job

### Audit Logs
- `GET /api/audit-logs` - List audit logs

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Application
NEXT_PUBLIC_APP_NAME="SentinelConnect"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Security (change in production!)
JWT_SECRET="your-super-secret-jwt-key"
ENCRYPTION_KEY="your-32-character-encryption-key"
```

## Development

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Run production server
```bash
npm start
```

### Database migrations
```bash
npx prisma migrate dev
```

### Open Prisma Studio
```bash
npx prisma studio
```

## Implemented Features

- [x] User authentication (NextAuth.js with credentials provider)
- [x] Real database connectors (PostgreSQL, MySQL, SQL Server)
- [x] SQLite file generation with better-sqlite3
- [x] Data masking (redact, hash, randomize, partial)
- [x] Credential encryption (AES-256-GCM)
- [x] Scheduled sync execution (node-cron)
- [x] File download endpoint
- [x] Comprehensive audit logging


### RUN app
npx next dev --port 5555


## Roadmap

- [ ] Cloud storage integration (Azure Blob, S3, GCS)
- [ ] Email notifications
- [ ] Oracle database connector
- [ ] Incremental sync with change tracking
- [ ] API key authentication
- [ ] Rate limiting
- [ ] Role-based access control

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.
