import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    const tenants = await prisma.tenant.findMany();
    console.log('Tenants:', tenants);
    
    const users = await prisma.user.findMany();
    console.log('Users:', users);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkData();