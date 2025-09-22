import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding comprehensive data...');

  // --- Clean up existing data to avoid conflicts ---
  await prisma.membership.deleteMany({});
  await prisma.journalEntry.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.purchase.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.company.deleteMany({});
  console.log('Previous data cleaned.');

  // --- Create User 1: Mukhtar ---
  const hashedPasswordMukhtar = await bcrypt.hash('123456', 10);
  const mukhtar = await prisma.user.create({
    data: {
      email: 'mukhtar@example.com',
      password: hashedPasswordMukhtar,
    },
  });

  // --- Create Company 1: Alameen General Trading ---
  const alameenCompany = await prisma.company.create({
    data: {
      name: 'Alameen General Trading',
    },
  });

  // --- Link Mukhtar to Alameen as ADMIN ---
  await prisma.membership.create({
    data: {
      userId: mukhtar.id,
      companyId: alameenCompany.id,
      role: 'ADMIN',
    },
  });
  console.log('Created Mukhtar and Alameen Company.');

  // --- Create Chart of Accounts for Alameen ---
  const cashAccount = await prisma.account.create({ data: { name: 'Cash on Hand', code: '10101', type: 'Asset', companyId: alameenCompany.id, isDebit: true } });
  const bankAccount = await prisma.account.create({ data: { name: 'Bank Al-Amal', code: '10102', type: 'Asset', companyId: alameenCompany.id, isDebit: true } });
  const receivablesAccount = await prisma.account.create({ data: { name: 'Accounts Receivable', code: '12001', type: 'Asset', companyId: alameenCompany.id, isDebit: true } });
  const inventoryAccount = await prisma.account.create({ data: { name: 'Inventory', code: '13001', type: 'Asset', companyId: alameenCompany.id, isDebit: true } });
  const payablesAccount = await prisma.account.create({ data: { name: 'Accounts Payable', code: '20101', type: 'Liability', companyId: alameenCompany.id, isDebit: false } });
  const salesRevenueAccount = await prisma.account.create({ data: { name: 'Sales Revenue', code: '40101', type: 'Revenue', companyId: alameenCompany.id, isDebit: false } });
  const cogsAccount = await prisma.account.create({ data: { name: 'Cost of Goods Sold', code: '50101', type: 'Expense', companyId: alameenCompany.id, isDebit: true } });
  const rentExpenseAccount = await prisma.account.create({ data: { name: 'Rent Expense', code: '50201', type: 'Expense', companyId: alameenCompany.id, isDebit: true } });
  console.log('Created Chart of Accounts for Alameen.');

  // --- Create Customers for Alameen ---
  const customer1 = await prisma.customer.create({ data: { name: 'Ahmed Ali', email: 'ahmed@customer.com', companyId: alameenCompany.id } });
  const customer2 = await prisma.customer.create({ data: { name: 'Fatima Saleh', email: 'fatima@customer.com', companyId: alameenCompany.id } });
  console.log('Created Customers.');

  // --- Create Suppliers for Alameen ---
  const supplier1 = await prisma.supplier.create({ data: { name: 'Global Imports Co.', email: 'contact@globalimports.com', companyId: alameenCompany.id } });
  const supplier2 = await prisma.supplier.create({ data: { name: 'Local Goods Inc.', email: 'sales@localgoods.com', companyId: alameenCompany.id } });
  console.log('Created Suppliers.');

  // --- Create Items for Alameen ---
  const item1 = await prisma.item.create({ data: { name: 'Laptop HP Pro', price: 1200, cost: 950, companyId: alameenCompany.id } });
  const item2 = await prisma.item.create({ data: { name: 'Wireless Mouse', price: 25, cost: 15, companyId: alameenCompany.id } });
  console.log('Created Items.');

  // --- Create a Sale Invoice ---
  await prisma.sale.create({
    data: {
      date: new Date(),
      totalAmount: 1225,
      status: 'Completed',
      companyId: alameenCompany.id,
      customerId: customer1.id,
    },
  });
  console.log('Created a Sale Invoice.');

  // --- Create a Purchase Invoice ---
  await prisma.purchase.create({
    data: {
      date: new Date(),
      totalAmount: 1100, // 10*950 + 10*15
      status: 'Completed',
      companyId: alameenCompany.id,
      supplierId: supplier1.id,
    },
  });
  console.log('Created a Purchase Invoice.');

  // --- Create a Journal Entry for Rent Payment ---
  await prisma.journalEntry.create({
    data: {
      date: new Date(),
      description: 'Paid monthly rent for the office',
      debitAmount: 500,
      creditAmount: 500,
      companyId: alameenCompany.id,
      debitAccountId: rentExpenseAccount.id,
      creditAccountId: cashAccount.id,
    },
  });
  console.log('Created a Journal Entry.');

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('An error occurred during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
