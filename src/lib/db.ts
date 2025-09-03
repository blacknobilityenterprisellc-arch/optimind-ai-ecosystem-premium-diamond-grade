// Mock database for Termux compatibility
export const db = {
  // User operations
  user: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => ({ id: 1, ...data, createdAt: new Date(), updatedAt: new Date() }),
    update: async (data: any) => ({ ...data, updatedAt: new Date() }),
    delete: async () => ({ id: 1 }),
    count: async () => 0,
  },
  // Add other models as needed
  project: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => ({ id: 1, ...data, createdAt: new Date(), updatedAt: new Date() }),
    update: async (data: any) => ({ ...data, updatedAt: new Date() }),
    delete: async () => ({ id: 1 }),
    count: async () => 0,
  },
  // Generic query operations
  $queryRaw: async () => [],
  $executeRaw: async () => ({ count: 1 }),
  // Transaction support
  $transaction: async (fn: any) => await fn(db),
}

console.log('Using mock database for Termux compatibility')
