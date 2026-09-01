# HAUSAURA — Scripts de maintenance

Ce dossier contient les scripts utilisés pour l'enrichissement, la vérification et la maintenance de la base de données.

## Utilisation

```bash
npx tsx scripts/<nom-du-script>.ts
```

---

## Scripts par catégorie

### Ajout de produits

| Script | Description |
|--------|-------------|
| `add-all-products.ts` | Ajoute tous les produits (import initial) |
| `add-products-aspirateurs.ts` | Ajoute les produits catégorie Aspirateurs |
| `add-products-cuisson.ts` | Ajoute les produits catégorie Cuisson |
| `add-products-froid.ts` | Ajoute les produits catégorie Froid |
| `add-products-kaffee.ts` | Ajoute les produits catégorie Café |
| `add-products-klima.ts` | Ajoute les produits catégorie Climatisation |
| `add-products-kueche.ts` | Ajoute les produits catégorie Cuisine |
| `add-products-lave-vaisselle.ts` | Ajoute les produits lave-vaisselle |
| `add-products-smarthome.ts` | Ajoute les produits Smart Home |
| `add-products-waschen.ts` | Ajoute les produits lave-linge |
| `add-stock.ts` | Ajoute des quantités de stock aléatoires aux produits |

### Enrichissement des données

| Script | Description |
|--------|-------------|
| `enrich-kaffee.ts` | Enrichit les descriptions des produits Café |
| `enrich-kueche.ts` | Enrichit les descriptions des produits Cuisine |
| `enrich-klima.ts` | Enrichit les descriptions des produits Climatisation |
| `enrich-reinigung.ts` | Enrichit les descriptions des produits Nettoyage |
| `enrich-smart-home.ts` | Enrichit les descriptions des produits Smart Home |
| `enrich-haushaltsgeraete.ts` | Enrichit les descriptions des appareils ménagers (partie 1) |
| `enrich-haushaltsgeraete-2.ts` | Enrichit les descriptions (partie 2) |
| `enrich-haushaltsgeraete-3.ts` | Enrichit les descriptions (partie 3) |
| `enrich-last3.ts` | Enrichit les derniers produits restants |

### Vérification et audit

| Script | Description |
|--------|-------------|
| `audit-db.ts` | Audit complet de la base de données |
| `audit.sql` | Requêtes SQL d'audit |
| `check-count.ts` | Vérifie le nombre de produits par catégorie |
| `check-miele.ts` | Vérifie les produits Miele spécifiquement |
| `deep-audit-images.ts` | Audit approfondi des images (doublons, orphelins) |
| `verify-all.ts` | Vérification complète de l'intégrité des données |
| `list-categories.ts` | Liste toutes les catégories avec compteur |
| `list-no-images.ts` | Liste les produits sans images |

### Listing par catégorie

| Script | Description |
|--------|-------------|
| `list-kaffee.ts` | Liste les produits Café |
| `list-kueche.ts` | Liste les produits Cuisine |
| `list-klima.ts` | Liste les produits Climatisation |
| `list-reinigung.ts` | Liste les produits Nettoyage |
| `list-smart-home.ts` | Liste les produits Smart Home |
| `list-smarthome.ts` | Variante du précédent |
| `list-haushaltsgeraete.ts` | Liste les appareils ménagers |
| `list-cuisson.ts` | Liste les produits de cuisson |
| `list-froid.ts` | Liste les produits de froid |
| `list-geschirrspueler.ts` | Liste les lave-vaisselle |
| `list-washen.ts` | Liste les lave-linge |

### Images

| Script | Description |
|--------|-------------|
| `create-image-folders.ts` | Crée les dossiers d'images pour chaque produit |
| `find-images.ts` | Recherche des images sur Bing |
| `optimize-images.ts` | Optimise les images en WebP (Sharp) |
| `update-product-images.ts` | Met à jour les URLs des images en base |
| `product-images.csv` | CSV de mapping produit → image |

### Outillage

| Script | Description |
|--------|-------------|
| `create-admin.ts` | Crée un compte administrateur |
| `algolia-sync.ts` | Synchronise les produits avec Algolia |

---

## Notes importantes

- **Ne pas exécuter les scripts d'ajout de produits deux fois** — ils créeraient des doublons
- Les scripts d'enrichissement sont sûrs à ré-exécuter (ils mettent à jour existant)
- Les scripts de vérification sont en lecture seule
- `add-stock.ts` écrase les valeurs de stock existantes
- Tous les scripts utilisent `prisma.$executeRawUnsafe` pour éviter les timeouts Supabase
