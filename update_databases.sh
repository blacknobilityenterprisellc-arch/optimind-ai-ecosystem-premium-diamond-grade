#!/bin/bash
npm run db:generate && npm run db:push && npm run db:migrate
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)
