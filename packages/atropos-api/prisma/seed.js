// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // 1) Company
  const company = await prisma.company.upsert({
    where: { taxNumber: '1111111111' },
    update: {},
    create: {
      name: 'Demo Company',
      taxNumber: '1111111111',
      taxOffice: 'Merkez',
      address: 'Adres',
      phone: '0000000000',
      email: 'demo@company.com',
    },
  });

  // 2) Branch
  const branch = await prisma.branch.create({
    data: {
      companyId: company.id,
      code: 'MAIN',
      name: 'Merkez Şube',
      address: 'Adres',
      phone: '0000000000',
      active: true,
    },
  }).catch(async (e) => {
    // If unique constraint exists on code, fallback to findFirst
    const existing = await prisma.branch.findFirst({ where: { companyId: company.id } });
    return existing;
  });

  // 3) SUPER_ADMIN user (admin/admin)
  const passwordHash = await bcrypt.hash('admin', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      companyId: company.id,
      branchId: branch?.id || null,
      username: 'admin',
      password: passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      active: true,
    },
  });

  // 4) Default Tax (KDV %10)
  const tax = await prisma.tax.upsert({
    where: { companyId_code: { companyId: company.id, code: 'VAT10' } },
    update: {},
    create: {
      companyId: company.id,
      name: 'KDV %10',
      rate: '10.00',
      code: 'VAT10',
      isDefault: true,
      isIncluded: true,
      active: true,
    },
  });

  // 5) Default Category
  const category = await prisma.category.create({
    data: {
      companyId: company.id,
      name: 'Genel',
      displayOrder: 0,
      active: true,
      showInMenu: true,
    },
  }).catch(async () => {
    const existing = await prisma.category.findFirst({ where: { companyId: company.id, name: 'Genel' } });
    return existing;
  });

  // 6) Sample Product
  await prisma.product.create({
    data: {
      companyId: company.id,
      categoryId: category.id,
      code: 'P001',
      name: 'Çay',
      images: [],
      basePrice: '15.00',
      taxId: tax.id,
      trackStock: false,
      unit: 'PIECE',
      available: true,
      sellable: true,
      showInMenu: true,
      active: true,
    },
  }).catch(async () => {
    // ignore if exists
  });

  // 7) Table Area and Table
  const area = await prisma.tableArea.create({
    data: {
      companyId: company.id,
      branchId: branch?.id || '',
      name: 'Salon',
      displayOrder: 0,
      active: true,
    },
  }).catch(async () => {
    const existing = await prisma.tableArea.findFirst({ where: { companyId: company.id, branchId: branch?.id, name: 'Salon' } });
    return existing;
  });

  await prisma.table.create({
    data: {
      branchId: branch?.id || '',
      areaId: area?.id || null,
      number: '1',
      name: 'Masa 1',
      capacity: 4,
      status: 'EMPTY',
      active: true,
    },
  }).catch(async () => {
    // ignore if exists (unique on branchId+number)
  });

  // 8) Payment Methods
  const cash = await prisma.paymentMethod.upsert({
    where: { companyId_code: { companyId: company.id, code: 'CASH' } },
    update: { active: true, name: 'Nakit' },
    create: {
      companyId: company.id,
      name: 'Nakit',
      code: 'CASH',
      type: 'CASH',
      displayOrder: 1,
      active: true,
    },
  });
  const credit = await prisma.paymentMethod.upsert({
    where: { companyId_code: { companyId: company.id, code: 'CC' } },
    update: { active: true, name: 'Kredi Kartı' },
    create: {
      companyId: company.id,
      name: 'Kredi Kartı',
      code: 'CC',
      type: 'CREDIT_CARD',
      displayOrder: 2,
      active: true,
    },
  });

  console.log('Seed completed:', { company: company.id, branch: branch?.id || null, admin: 'admin/admin', tax: tax.id, category: category?.id || null, paymentMethods: [cash.code, credit.code] });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
