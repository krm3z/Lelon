# LELON — Journal de la session de nuit (23 → 24/09/2026)

Changements importants seulement. Heures UTC.

| Heure | Action | Vérification |
|---|---|---|
| 21:54 | Contrôle initial : thème publié `205028163918` inchangé (maj 22/09 21:56), DRAFT `205057753422` non publié, PR #1 propre | Admin API, GitHub |
| 21:55 | Inventaire des outils : **aucun générateur d’images** (ni outil, ni clé d’API, ni GPU ; hôtes des générateurs bloqués). `lelon.fr` et le CDN Shopify bloqués → QA visuelle **LOCALE uniquement** | `curl`, variables d’environnement |
| 22:00 | Export Admin API lecture seule : 17 produits, **55 variantes** (et non 57), stock, emplacements, médias | GraphQL |
| 22:05 | **Bug corrigé** : la galerie affichait la photo portée ÉLÉA Cognac sur ÉLÉA Noir (alt libre non reconnu) | banc local |
| 22:05 | **Bug corrigé** : une fiche à une seule photo (ISAURE) plaçait l’image dans la colonne des miniatures sur desktop | capture 1440 |
| 22:05 | Galerie : filtre coloris côté serveur, note honnête pour les coloris sans photo, lecture du metafield `lelon.lifestyle_media` | 42/42 tests, Theme Check 0 |
| 22:10 | Batch photos portées : matrice 55 variantes, 157 prompts, registre QA, couverture, outil ΔE00 | `tools/image-batch/build.py` |
| 22:12 | Envoi DRAFT (7 fichiers) | MD5 identiques |
| 22:20 | **Diagnostic CJ** : 54/55 variantes à l’emplacement manuel, 1 à `cjdropshipping` ; l’emplacement manuel est **absent du profil d’expédition** | GraphQL lecture seule |
| 22:25 | Livraison vérifiée : France 0,99 €, offerte dès 90 € (confirmé) ; 0 commande | GraphQL |
| 22:30 | `docs/inventory-cj-diagnostic.md`, `docs/product-data-audit.md`, `BLOCKED_BY_MERCHANT.md` | — |
