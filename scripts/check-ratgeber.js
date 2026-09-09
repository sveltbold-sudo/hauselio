require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  try {
    const tables = await p.$queryRawUnsafe("SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename ILIKE '%ratgeber%'");
    console.log('Ratgeber tables:', JSON.stringify(tables));
    
    if (tables.length === 0) {
      console.log('NO RatgeberArticle TABLE - this is the crash cause!');
      
      // Check all tables
      const all = await p.$queryRawUnsafe("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
      console.log('All tables:', all.map(t => t.tablename).join(', '));
    } else {
      console.log('Table exists:', tables[0].tablename);
      
      // Check columns
      const cols = await p.$queryRawUnsafe("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1", tables[0].tablename);
      console.log('Columns:', cols.map(c => c.column_name).join(', '));
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await p.$disconnect();
  }
})();
