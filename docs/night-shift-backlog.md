# LELON — Backlog de la session de nuit

Statuts : `TODO` · `IN_PROGRESS` · `DONE` · `BLOCKED` · `REJECTED`.

| # | Tâche | Statut | Note |
|---|---|---|---|
| 1 | Vérifier workspace, DRAFT non publié, thème publié intact | DONE | contrôlé au début et à la fin |
| 2 | Relire rapport précédent, audit photo, parrainage, README | DONE | |
| 3 | Inventaire des outils (dont génération d’images) | DONE | aucun générateur ; QA visuelle Shopify réelle impossible (réseau) |
| 4 | Ouvrir la prévisualisation Shopify réelle | BLOCKED | `lelon.fr` bloqué par le proxy → banc local |
| 5 | Matrice PRODUIT × COLORIS × TAILLE depuis Shopify | DONE | 55 variantes |
| 6 | Références réelles par variante | DONE | Shopify + zip, relevé visuel |
| 7 | Générer 2–3 photos portées par variante | BLOCKED | aucun générateur ; batch prêt (157 prompts) |
| 8 | `docs/image-generation-batch.md` + `batch.json` | DONE | |
| 9 | `docs/generated-image-qa.md`, `docs/photo-coverage-report.md` | DONE | |
| 10 | Outil QA couleur ΔE00 + planches de revue | DONE | vérifié sur données de référence CIEDE2000 |
| 11 | Architecture d’intégration DRAFT sans toucher au thème publié | DONE | metafield `lelon.lifestyle_media` + Files |
| 12 | Galerie : fuite de coloris des photos portées | DONE | corrigé + testé |
| 13 | Galerie : fiche à une photo sur desktop | DONE | corrigé |
| 14 | Galerie : coloris sans photo | DONE | note honnête |
| 15 | Enquête Inventaire / CJ (A → E) | DONE | cause D confirmée + blocage expédition |
| 16 | Corriger stock / CJ / expédition | BLOCKED | décision marchand (P0-1, P0-2) |
| 17 | Audit données produit | DONE | 14 constats |
| 18 | Appliquer les corrections de données produit | BLOCKED | modifient le thème publié → marchand |
| 19 | `BLOCKED_BY_MERCHANT.md` | DONE | |
| 20 | Recherche prédictive : ne pas chercher dans les tags/SKU internes | DONE | champs publics + annulation des requêtes périmées |
| 21 | Revue JS (courses, doubles écouteurs, historique, focus) | DONE | délégation (éditeur), tests panier : double clic, clics rapides, coupure réseau, 422 |
| 22 | Revue CSS (code mort, `!important`, z-index) | DONE | 0 classe morte ; `!important` restants = utilitaires (hidden, visually-hidden, reduced-motion) ; z-index ordonnés |
| 23 | Sécurité (XSS, secrets, logs) | DONE | HTML injecté = sections Shopify même origine ; messages en textContent ; aucun secret ni console.log |
| 24 | QA responsive 320 → 1920, landing, 404 | DONE | 18 pages × 10 largeurs ; 2 défauts corrigés (menu 1024, galerie 1920) |
| 25 | axe-core + clavier | DONE | 0 violation WCAG 2.1 AA ; clavier galerie, recherche, tiroirs |
| 26 | Performance (poids JS/CSS/polices, LCP) | DONE | Lighthouse Shopify impossible (réseau) |
| 27 | Landing page : audit | DONE | hero = photo portée validée, galerie portée en premier |
| 28 | Parrainage : améliorer la doc | DONE | lien de réduction natif, accès compte, états, checklist |
| 29 | 21 fichiers neutralisés | BLOCKED | suppression API bloquée (P2-1) |
| 30 | MORNING-REPORT + intégrité finale | DONE | |
| 31 | Accroche PDP tronquée (description SEO) | DONE | première phrase de la description |
| 32 | Boutons de quantité < 44 px | DONE | 44 × 44 |
| 33 | Relecture visuelle sur la vraie prévisualisation Shopify | BLOCKED | réseau ; à faire par le marchand (P0) |
| 34 | Générer une photo portée « test » pour valider la méthode | REJECTED | aucun générateur : ne rien prétendre |
