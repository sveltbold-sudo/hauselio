const { PrismaClient } = require('@prisma/client');

// Test both connection strings
const urls = {
  direct: 'postgresql://postgres.yynxnlfiadgrfkskwhlh:!pR_Rc%40%2F.2W.L5W@aws-0-eu-central-1.pooler.supabase.com:5432/postgres',
  pooler: 'postgresql://postgres.yynxnlfiadgrfkskwhlh:!pR_Rc%40%2F.2W.L5W@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
};

async function test(name, url) {
  const p = new PrismaClient({ datasourceUrl: url });
  try {
    const count = await p.product.count();
    console.log(`[${name}] OK, products: ${count}`);
  } catch (e) {
    console.error(`[${name}] FAIL:`, e.message.slice(0, 200));
  }
  await p.$disconnect();
}

(async () => {
  await test('direct:5432', urls.direct);
  await test('pooler:6543', urls.pooler);
})();
