require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  try {
    const tables = await p.$queryRawUnsafe("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    console.log('Tables:', tables.map(t => t.tablename).join(', '));
    
    const cat = tables.find(t => t.tablename.toLowerCase() === 'category');
    const prod = tables.find(t => t.tablename.toLowerCase() === 'product');
    console.log('Category table:', cat?.tablename);
    console.log('Product table:', prod?.tablename);

    if (cat) {
      const cols = await p.$queryRawUnsafe("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1", cat.tablename);
      const hasLong = cols.some(c => c.column_name === 'longDescription');
      console.log('Category has longDescription:', hasLong);
      if (!hasLong) {
        await p.$executeRawUnsafe(`ALTER TABLE "${cat.tablename}" ADD COLUMN IF NOT EXISTS "longDescription" TEXT`);
        console.log('✅ Added longDescription to', cat.tablename);
      } else {
        console.log('ℹ️  Already exists');
      }
    }

    if (prod) {
      const cols = await p.$queryRawUnsafe("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1", prod.tablename);
      const hasLong = cols.some(c => c.column_name === 'longDescription');
      console.log('Product has longDescription:', hasLong);
      if (!hasLong) {
        await p.$executeRawUnsafe(`ALTER TABLE "${prod.tablename}" ADD COLUMN IF NOT EXISTS "longDescription" TEXT`);
        console.log('✅ Added longDescription to', prod.tablename);
      } else {
        console.log('ℹ️  Already exists');
      }
    }

    console.log('\n✅ Migration terminée !');
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await p.$disconnect();
  }
})();
