require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  try {
    // Create RatgeberArticle table
    await p.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "RatgeberArticle" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "excerpt" TEXT,
        "content" TEXT NOT NULL,
        "coverImage" TEXT,
        "authorName" TEXT NOT NULL DEFAULT 'HAUSAURA Redaktion',
        "category" TEXT NOT NULL,
        "tags" TEXT[] DEFAULT '{}',
        "mentionedProductSlugs" TEXT[] DEFAULT '{}',
        "seoTitle" TEXT,
        "seoDesc" TEXT,
        "isPublished" BOOLEAN NOT NULL DEFAULT false,
        "publishedAt" TIMESTAMP(3),
        "readingTime" INTEGER,
        "viewCount" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "RatgeberArticle_pkey" PRIMARY KEY ("id")
      )
    `);
    console.log('✅ Table RatgeberArticle created');

    // Create indexes
    await p.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "RatgeberArticle_isPublished_publishedAt_idx" ON "RatgeberArticle"("isPublished", "publishedAt")`);
    await p.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "RatgeberArticle_category_idx" ON "RatgeberArticle"("category")`);
    await p.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "RatgeberArticle_slug_key" ON "RatgeberArticle"("slug")`);
    console.log('✅ Indexes created');

    // Verify
    const tables = await p.$queryRawUnsafe("SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'RatgeberArticle'");
    console.log('Verification:', tables.length > 0 ? 'Table exists!' : 'TABLE MISSING!');
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await p.$disconnect();
  }
})();
