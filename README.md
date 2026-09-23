# LELON — Refonte 2026

Thème Shopify Online Store 2.0 sur mesure pour **LELON**, marque française de sacs pour femme.

| Dossier | Contenu |
|---|---|
| `theme/` | Source complète du thème **« LELON — Refonte 2026 — DRAFT »** (Shopify id `205057753422`, non publié). Identique fichier par fichier au brouillon en ligne. |
| `reference/live-theme-2026-09-23/` | Instantané du thème publié au 23/09/2026 (« Cinématique · correctif accueil »), conservé comme référence et sauvegarde. |
| `docs/RAPPORT-FINAL.md` | Audit, modifications, QA, priorités P0 → P3. |
| `docs/photographie.md` | Audit photo produit par produit. |
| `docs/parrainage-architecture.md` | Architecture serveur du parrainage (non actif). |
| `docs/MORNING-REPORT.md` | Rapport de la session de nuit du 23 → 24/09/2026 (état final, P0/P1). |
| `BLOCKED_BY_MERCHANT.md` | Décisions marchand en attente (stock/CJ, expédition, légal, photos…). |
| `docs/inventory-cj-diagnostic.md` · `docs/product-data-audit.md` | Diagnostic stock/CJ et audit des données produit (lecture seule). |
| `docs/product-image-matrix.md` · `docs/image-generation-batch.md` | Matrice des 55 variantes et batch des photos portées (prêt, non généré). |
| `tools/qa/` | Banc de QA local : Theme Check, rendu Liquid, captures responsive, axe-core, tests d'interaction. |
| `tools/image-batch/` | Génération des documents photo depuis l'Admin API, contrôle couleur ΔE00, planches de revue. |

## Prévisualiser

`https://lelon.fr/?preview_theme_id=205057753422` (depuis une session admin Shopify).
Le thème n'est **jamais publié automatiquement** : la publication se fait dans l'admin, après validation.

## Déployer une modification sur le brouillon

Avec Shopify CLI : `shopify theme push --theme 205057753422 --path theme`
(ne jamais cibler le thème publié).

## QA locale

```bash
cd tools/qa && npm install
npm run lint                      # Theme Check officiel
IMGS=/chemin/LELON-Images PRODUCTS_JSON=/chemin/products.json MEDIA_JSON=/chemin/medias.json WITH_WORN=1 npm run serve   # banc (port 4777)
CHROMIUM=/chemin/chrome npm run qa         # 18 pages × 10 largeurs (320 → 1920) : overflow + axe-core
CHROMIUM=/chemin/chrome npm run interact   # variantes, galerie, panier (courses, pannes), menu, recherche, cookies, ouverture
```

`PRODUCTS_JSON` = export Admin API `products { nodes { … variants, options, metafields … } }`.
`MEDIA_JSON` (facultatif) = export Admin API avec `media { alt }` : le banc reproduit alors la vraie liste de médias Shopify
et leurs textes alternatifs (photos du zip en remplacement des fichiers du CDN). `WITH_WORN=1` ajoute des photos portées
de test sur MIRA pour vérifier l'intégration du metafield `lelon.lifestyle_media`.
Le banc est un outil de mise en page : il ne remplace pas la prévisualisation Shopify.

## Règles du projet

Logo LELON inchangé · aucun prix ni stock codé en dur · aucune donnée produit, légale ou sociale inventée ·
metafields remplis uniquement avec des valeurs vérifiées · publication sur validation explicite.
