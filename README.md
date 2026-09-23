# LELON — Refonte 2026

Thème Shopify Online Store 2.0 sur mesure pour **LELON**, marque française de sacs pour femme.

| Dossier | Contenu |
|---|---|
| `theme/` | Source complète du thème **« LELON — Refonte 2026 — DRAFT »** (Shopify id `205057753422`, non publié). Identique fichier par fichier au brouillon en ligne. |
| `reference/live-theme-2026-09-23/` | Instantané du thème publié au 23/09/2026 (« Cinématique · correctif accueil »), conservé comme référence et sauvegarde. |
| `docs/RAPPORT-FINAL.md` | Audit, modifications, QA, priorités P0 → P3. |
| `docs/photographie.md` | Audit photo produit par produit. |
| `docs/parrainage-architecture.md` | Architecture serveur du parrainage (non actif). |
| `tools/qa/` | Banc de QA local : Theme Check, rendu Liquid, captures responsive, axe-core, tests d'interaction. |

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
IMGS=/chemin/LELON-Images PRODUCTS_JSON=/chemin/products.json npm run serve   # banc de rendu (port 4777)
CHROMIUM=/chemin/chrome npm run qa         # 14 pages × 375/390/430/768/1440 : overflow + axe-core
CHROMIUM=/chemin/chrome npm run interact   # variantes, panier, menu, recherche, cookies, ouverture
```

`PRODUCTS_JSON` = export Admin API `products { nodes { … variants, options, metafields … } }`.
Le banc est un outil de mise en page : il ne remplace pas la prévisualisation Shopify.

## Règles du projet

Logo LELON inchangé · aucun prix ni stock codé en dur · aucune donnée produit, légale ou sociale inventée ·
metafields remplis uniquement avec des valeurs vérifiées · publication sur validation explicite.
