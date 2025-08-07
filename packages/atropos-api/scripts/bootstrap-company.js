const { PrismaClient } = require('@prisma/client');
(async () => {
  const p = new PrismaClient();
  try {
    const existing = await p.company.findFirst();
    if (existing) {
      console.log('Company already exists:', existing.id);
      process.exit(0);
    }
    const company = await p.company.create({
      data: {
        name: 'Demo Company',
        taxNumber: '1111111111',
        taxOffice: 'Merkez',
        address: 'Adres',
        phone: '0000000000',
        email: 'demo@company.com'
      }
    });
    console.log('Company created:', company.id);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await p.();
  }
})();
