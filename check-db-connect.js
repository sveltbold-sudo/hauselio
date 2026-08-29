const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.product.count().then(c => {
  console.log('DB OK, products:', c);
  return p.$disconnect();
}).catch(e => {
  console.error('DB FAIL:', e.message);
  return p.$disconnect();
});
