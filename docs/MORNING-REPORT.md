# LELON — Morning Report

Session de nuit du 23 → 24/09/2026 · thème **« LELON — Refonte 2026 — DRAFT »** (`205057753422`) · **non publié**.

## 1. Résumé exécutif

- **Le thème publié n’a pas été touché** et le DRAFT n’est pas publié (vérifié par l’API au début et à la fin).
- **Photos portées : 0 image générée.** Aucun outil de génération d’images n’existe dans l’environnement de travail
  (ni outil, ni clé d’API, ni GPU ; les hôtes des générateurs sont bloqués). Je ne prétends donc rien avoir généré.
  À la place, le **batch complet est prêt** : 55 variantes réelles, 157 visuels ciblés avec prompts A/B/C, contraintes,
  QA, nommage, alts, un outil de contrôle couleur (ΔE00) et une intégration DRAFT qui **ne touche pas** aux médias produit.
- **Découverte critique (lecture seule)** : 54 variantes sur 55 sont stockées à l’emplacement manuel du marchand et non à
  l’emplacement CJ, **et cet emplacement manuel n’est dans aucun profil d’expédition**. Même avec du stock, le paiement
  ne proposerait aucune livraison pour ces 54 variantes. Rien n’a été corrigé : décision marchand (P0-1, P0-2).
- **9 corrections dans le DRAFT**, dont 3 visibles immédiatement par les clientes : la photo portée Cognac d’ÉLÉA s’affichait sur le
  coloris Noir ; la phrase d’accroche des fiches reprenait la description SEO coupée au milieu d’un mot (« …à la collectio »).
- QA **locale** (la prévisualisation Shopify réelle reste inaccessible depuis l’environnement) : voir §4.

## 2. Modifications effectuées

**Thème DRAFT** (envoyé fichier par fichier, sommes MD5 contrôlées) :

| Fichier | Changement |
|---|---|
| `snippets/lelon-product-gallery.liquid` | Filtre coloris rendu côté serveur (pas de flash, fonctionne sans JS) ; lecture du coloris dans n’importe quel alt ; note honnête quand un coloris n’a pas de photo ; photos portées du metafield `lelon.lifestyle_media` ; une seule photo = pleine largeur |
| `snippets/lelon-media-color.liquid` (nouveau) | Règle unique « quel coloris montre ce média » |
| `sections/lelon-main-product.liquid` | Réglage « Photo portée en premier » ; accroche = première phrase de la description (plus la description SEO tronquée) |
| `sections/lelon-landing-product.liquid` | Hero de campagne = photo portée validée si elle existe ; galerie portée en premier |
| `assets/lelon.js` | Galerie pilotée par `data-media-color` ; recherche prédictive : annulation des requêtes périmées, messages sans `innerHTML`, recherche limitée aux champs publics (plus de correspondance sur tags internes ou SKU fournisseur) ; dialogues et filtres robustes au rechargement de section dans l’éditeur |
| `assets/lelon.css` | Boutons de quantité 44 × 44 px ; suppression d’un `!important` ; mise en page galerie ; menu desktop à partir de 1100 px ; galerie plus large ≥ 1600 px |
| `locales/*.json` | Texte « Pas encore de photo du coloris … » ; clé inutilisée retirée |

**Dépôt** : `tools/image-batch/` (batch photos), banc de QA étendu (médias Shopify réels, `?variant=`, 18 pages × 10 largeurs,
tests galerie, panier et pannes réseau), documents listés au §19.

**Shopify hors thème** : **rien**. Aucune écriture de produit, média, stock, emplacement, CJ, expédition, prix, politique ou client.

## 3. Bugs trouvés et corrigés

| # | Bug | Origine | Correction | Preuve |
|---|---|---|---|---|
| 1 | ÉLÉA Noir affichait la photo portée **Cognac** (idem NOVA, SOLÉA, VÉLORA) : alt libre non reconnu → média traité comme « neutre » | ma refonte | coloris lu n’importe où dans l’alt | test « ÉLÉA Noir: worn Cognac photo not shown » |
| 2 | Accroche PDP = description SEO **coupée au milieu d’un mot** sur 8 produits | ma refonte | première phrase complète de la description | capture 320 px avant/après |
| 3 | Fiche à **une seule photo** (ISAURE) : image placée dans la colonne des miniatures (76 px) sur desktop | ma refonte | grille à 2 colonnes seulement avec miniatures | capture 1440 px |
| 4 | Boutons − / + du panier à **40 px** (cible 44 px) | ma refonte | 44 × 44 px | CSS |
| 5 | Recherche prédictive : une réponse tardive pouvait réafficher des résultats après effacement ; correspondance possible sur `lelon-cj` / `CJNS…` | ma refonte | abandon des requêtes, champs publics | code + tests |
| 6 | Éditeur de thème : un tiroir ou des filtres rechargés perdaient leurs écouteurs | ma refonte | délégation d’événements | code |
| 7 | **1024 px** : le menu desktop touchait le logo LELON (≈ 10 px d’écart) | ma refonte | menu complet à partir de 1100 px, tiroir en dessous | captures 1024 / 1100 |
| 8 | **1920 px** : galerie produit étroite (image ≈ 620 px) | ma refonte | grille produit élargie à ≥ 1600 px (image ≈ 760 px) | capture 1920 |
| 9 | `!important` superflu sur le champ quantité | ma refonte | spécificité | CSS |

## 4. Visual QA

**LOCAL ONLY.** `lelon.fr`, `*.myshopify.com` et `cdn.shopify.com` sont bloqués par le proxy : la prévisualisation Shopify
réelle n’a **pas** pu être ouverte. Tests sur le banc local (vrais templates Liquid, vraies données des 17 produits, **liste réelle
des médias Shopify et de leurs alts**, photos du zip en remplacement des fichiers CDN, Chromium).

| Contrôle | Résultat |
|---|---|
| Pages | accueil, 4 fiches (LUNA ; VERA avec disponibilité simulée ; AURÉA coloris sans photo ; ISAURE une seule photo), collection, Signature, FAQ, contact, notre histoire, livraison & retours, mentions légales, cookies, landing, panier, recherche, compte, 404 (18) |
| Largeurs | 320 · 375 · 390 · 393 · 430 · 768 · 1024 · 1280 · 1440 · 1920 (10) |
| Débordement horizontal | **0** sur 180 pages |
| axe-core WCAG 2.1 AA | **0** violation sur 180 pages |
| Erreurs JavaScript | **0** |
| Tests d’interaction | **49 / 49** (variantes, galerie, panier, pannes réseau, menu, recherche, cookies, ouverture, clavier, sans JS) |
| Theme Check (Shopify) | **0** erreur, 0 avertissement |

Passage complet n° 1 (18 × 10) : propre. Il a fait apparaître 3 défauts visuels, corrigés ensuite : accroche tronquée
(320 px), menu contre le logo (1024 px), galerie étroite (1920 px). Passage final sur le code définitif : **180 / 180 pages propres** (0 débordement, 0 violation axe, 0 erreur JS).

Captures inspectées : 320 px (accueil, fiche, landing, 404, panier), 1024 / 1100 px (en-tête), 1280 et 1920 px (accueil, fiche).
Non testé : rendu Shopify réel (Liquid Shopify, CDN d’images, checkout), vrais appareils, Safari iOS.

## 5. Mobile

Largeurs 320, 375, 390, 393, 430, 768 : 0 débordement, 0 violation axe sur les 18 pages.
- Cibles tactiles ≥ 44 px (menu, quantité panier corrigée à 44 px).
- Galerie en swipe natif, compteur « n / total » juste après filtrage par coloris.
- Barre d’achat mobile uniquement si la variante est réellement achetable.
- Accroche de fiche désormais complète (plus de phrase coupée).
- 768 et 1024 px : tiroir de menu (le menu complet n’apparaît qu’à partir de 1100 px).

## 6. PDP

- Variante → prix, disponibilité, bouton, URL `?variant=`, identifiant de formulaire, galerie : testés.
- Rechargement avec `?variant=` (VERA Noir / L) : options et galerie restaurées.
- Coloris sans photo (AURÉA Beige Sable, ISAURE Cognac, VERA Rouge) : toutes les photos + note « les images présentent un
  autre coloris » (plus de photo d’un autre coloris présentée comme celle de la variante).
- Produit indisponible (état réel) : « Bientôt disponible », bouton désactivé, barre mobile masquée, aucun faux stock.
- Metafields vides : composants masqués (dimensions, matière…).
- Sans JavaScript : galerie déjà filtrée, formulaire d’ajout fonctionnel.

## 7. Cart / Search / Navigation

- Panier : double-clic → **une** requête ; clics rapides sur la quantité sans erreur ; coupure réseau → message et bouton
  réutilisable ; refus Shopify (422) → message de Shopify affiché ; tiroir Commander / Voir le panier ; Échap et retour du focus.
- Recherche : clavier (flèches, Entrée), Échap, aucun résultat, requêtes périmées annulées.
- Navigation : tiroir mobile, `aria-expanded`, cibles ≥ 44 px.
- Consentement : Accepter / Refuser / Personnaliser au même niveau, rien de précoché, « Gérer mes cookies ».

## 8. Inventory / CJ

**Aucun stock modifié.** Diagnostic complet : `docs/inventory-cj-diagnostic.md`.

| Hypothèse | Verdict |
|---|---|
| A — mauvais niveau de stock lu | écartée (1 seul niveau par article, tous lus, tous à 0) |
| B — stock CJ non remonté | non vérifiable sans accès CJ ; plausible |
| C — synchro absente | probable pour 54 variantes (non rattachées à l’emplacement CJ) |
| D — emplacement / service incorrect | **confirmée** : 54/55 à l’emplacement manuel, 1 (ÉLÉA Cognac) chez CJ |
| E — autre | **l’emplacement manuel n’est dans aucun profil d’expédition** → pas de livraison au paiement ; pré-lancement volontaire probable |

Livraison vérifiée dans les réglages : France **0,99 €**, **offerte dès 90 €** (le tarif 0,99 € reste aussi proposé au-delà de 90 €).

## 9. Product Data

`docs/product-data-audit.md` — 14 constats, dont : 8 descriptions SEO coupées (propositions prêtes), catégorie Shopify vide,
ordre des dimensions incohérent (metafields non remplis volontairement), allégations « cuir véritable » à prouver,
« cuir synthétique » (VERA) à revoir, 4 variantes sans photo, LUNA probablement inversée entre deux coloris.

## 10. Photography Generation

| Indicateur | Valeur |
|---|---|
| Variantes réelles (modèle × coloris × format) | **55** |
| Objectif photos mannequin (2–3 par variante) | **110 – 165** |
| Cible atteignable avec les références actuelles | 157 (dont 39 en attente de décision marchand) |
| Photos générées | **0** — aucun générateur disponible |
| Acceptées | 0 |
| Rejetées | 0 |
| Intégrées uniquement dans le DRAFT | 0 (architecture prête : Files + metafield `lelon.lifestyle_media`) |
| Nécessitant validation humaine | 4 photos portées déjà en ligne, origine inconnue (P1-4) |
| Nécessitant une vraie séance photo | 2 variantes sans aucune référence (VERA Rouge M/L) + tous les **intérieurs** |

Statuts des 55 variantes : `READY_FOR_GENERATION` 38 · `READY_LIMITED` 2 · `BLOCKED_BY_MERCHANT` 13 · `REAL_PHOTOS_REQUIRED` 2.
Documents : `docs/product-image-matrix.md`, `docs/image-generation-batch.md`, `docs/generated-image-qa.md`,
`docs/photo-coverage-report.md`, `tools/image-batch/`.

## 11. Photography by Product

Aucune image générée. Pour chaque variante réelle : état du visuel A (porté hero), B (porté alternatif), C (lifestyle).

| MODEL | COLOR | SIZE | IMAGE A | IMAGE B | IMAGE C | STATUS |
|---|---|---|---|---|---|---|
| ÉLÉA | Cognac | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| ÉLÉA | Noir | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| ÉLÉA | Ivoire | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| ÉLÉA | Sable | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| MIRA | Ivoire | — | non générée · en attente | non générée · en attente | non générée · en attente | BLOCKED_BY_MERCHANT — MERCHANT_DECISION_TAG |
| MIRA | Taupe | — | non générée · en attente | non générée · en attente | non générée · en attente | BLOCKED_BY_MERCHANT — MERCHANT_DECISION_TAG |
| MIRA | Noir | — | non générée · en attente | non générée · en attente | non générée · en attente | BLOCKED_BY_MERCHANT — MERCHANT_DECISION_TAG |
| NOVA | Chocolat | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| NOVA | Bordeaux | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| NOVA | Noir | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| NOVA | Camel | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| SOLÉA | Beige & Cognac | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| SOLÉA | Beige & Noir | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| LYRA | Chocolat | — | non générée · en attente | non générée · en attente | non générée · en attente | BLOCKED_BY_MERCHANT — MERCHANT_DECISION_ACCESSORIES |
| LYRA | Ivoire | — | non générée · en attente | non générée · en attente | non générée · en attente | BLOCKED_BY_MERCHANT — MERCHANT_DECISION_ACCESSORIES |
| LYRA | Noir | — | non générée · en attente | non générée · en attente | non générée · en attente | BLOCKED_BY_MERCHANT — MERCHANT_DECISION_ACCESSORIES |
| LUNA | Crème & Chocolat | — | non générée · en attente | non générée · en attente | non générée · en attente | BLOCKED_BY_MERCHANT — VARIANT_MAPPING_TO_CONFIRM |
| LUNA | Taupe & Chocolat | — | non générée · en attente | non générée · en attente | non générée · en attente | BLOCKED_BY_MERCHANT — VARIANT_MAPPING_TO_CONFIRM |
| LUNA | Noir | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| ALYA | Cognac | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| ALYA | Ivoire | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| ALYA | Noir | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| LILA | Chocolat | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| LILA | Ivoire | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| LILA | Noir | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| LILA | Vert | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| VERA | Caramel | M | non générée · en attente | non générée · en attente | non générée · en attente | BLOCKED_BY_MERCHANT — LEGAL_REVIEW_REQUIRED, SIZE_REFERENCE_REQUIRED |
| VERA | Noir | M | non générée · en attente | non générée · en attente | non générée · en attente | BLOCKED_BY_MERCHANT — LEGAL_REVIEW_REQUIRED, SIZE_REFERENCE_REQUIRED |
| VERA | Noir | L | non générée · en attente | non générée · en attente | non générée · en attente | BLOCKED_BY_MERCHANT — LEGAL_REVIEW_REQUIRED, SIZE_REFERENCE_REQUIRED |
| VERA | Caramel | L | non générée · en attente | non générée · en attente | non générée · en attente | BLOCKED_BY_MERCHANT — LEGAL_REVIEW_REQUIRED, SIZE_REFERENCE_REQUIRED |
| VERA | Rouge | M | — (vraie photo) | — (vraie photo) | — (vraie photo) | REAL_PHOTOS_REQUIRED — LEGAL_REVIEW_REQUIRED, SIZE_REFERENCE_REQUIRED, NEEDS_REAL_REFERENCE |
| VERA | Rouge | L | — (vraie photo) | — (vraie photo) | — (vraie photo) | REAL_PHOTOS_REQUIRED — LEGAL_REVIEW_REQUIRED, SIZE_REFERENCE_REQUIRED, NEEDS_REAL_REFERENCE |
| NAYA | Chocolat | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| NAYA | Noir | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| NAYA | Ivoire | — | non générée · prompt prêt | non générée · prompt prêt | n/a (référence faible) | READY_LIMITED — REFERENCE_WEAK |
| AURÉA | Noir | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| AURÉA | Taupe / Greige | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| AURÉA | Beige Sable | — | non générée · en attente | non générée · en attente | non générée · en attente | BLOCKED_BY_MERCHANT — REFERENCE_TO_CONFIRM |
| ELARA | Cognac | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| ELARA | Noir | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| ISAURE | Cognac | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| ISAURE | Noir | — | non générée · prompt prêt | non générée · prompt prêt | n/a (référence faible) | READY_LIMITED — REFERENCE_WEAK |
| CÉLÈNE | Taupe | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| CÉLÈNE | Noir | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| CÉLÈNE | Ivoire | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| CÉLÈNE | Cognac | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| VÉLORA | Camel | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| VÉLORA | Noir | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| VÉLORA | Ivoire | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| AMARA | Ivoire | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| AMARA | Sauge | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| AMARA | Rose Poudré | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| NOREA | Noir | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| NOREA | Ivoire | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |
| NOREA | Chocolat | — | non générée · prompt prêt | non générée · prompt prêt | non générée · prompt prêt | READY_FOR_GENERATION |

## 12. Performance

- JS total du thème : `lelon.js` 28 Ko (8 Ko gzip), module différé, sans dépendance (le thème publié charge three.js + GSAP, ~690 Ko).
- CSS : 62 Ko (13 Ko gzip), une seule feuille, préchargée. Polices : 2 woff2 préchargées (37 Ko), italique à la demande, `font-display: swap`.
- LCP : image de la variante en `fetchpriority=high` + `loading=eager`, toutes les autres en `lazy`, `srcset` Shopify.
- CLS : galerie filtrée côté serveur (plus de saut au chargement), ratios fixes.
- Lighthouse : **non exécuté** sur Shopify (réseau bloqué) ; un score local sur le banc ne serait pas représentatif.

## 13. Accessibility

- axe-core (WCAG 2.0 A/AA + 2.1 AA) : **0 violation** sur 18 pages × 10 largeurs.
- Clavier : 89 arrêts de tabulation testés sur l’accueil et une fiche, **focus visible sur chacun** ; galerie aux flèches ;
  recherche en combobox (`aria-activedescendant`) ; tiroirs fermés par Échap avec retour du focus.
- Coloris sans photo : annoncé en texte (pas seulement visuellement).
- Mouvement : ouverture et révélations désactivées avec `prefers-reduced-motion` et via le bouton « Réduire les animations ».

## 14. SEO

- Un H1 par page, balises `title` / `description` / canonical / Open Graph / Twitter, `Product` (Shopify `structured_data`),
  `BreadcrumbList`, `Organization` ; **aucun schéma d’avis**.
- Alts des futures photos portées : descriptifs, sans mots-clés (« Sac ÉLÉA noir LELON porté à l’épaule »).
- À faire côté données : 8 descriptions SEO tronquées, catégories produit (P1-8).

## 15. Legal / Privacy

- Pages légales = vraies politiques Shopify (rien d’inventé). Toujours manquants : **médiateur**, **CGV complètes**,
  **politique de cookies** (P0-4).
- Allégations de matière à prouver (P0-5) ; VERA à faire vérifier (P0-6).
- Images générées futures : visuels de marque, jamais présentés comme des clientes, des avis ou de l’UGC.

## 16. BLOCKED BY MERCHANT

Voir `BLOCKED_BY_MERCHANT.md` : 6 P0, 9 P1, 3 P2.

## 17. P0 AVANT PUBLICATION

1. Stock et mapping CJ (P0-1) + profil d’expédition (P0-2) + **commande test** par emplacement.
2. Médiateur, CGV complètes, politique de cookies (P0-4).
3. Preuves « cuir véritable » / formulation VERA (P0-5) ; avis juridique VERA (P0-6).
4. **Relecture visuelle de la prévisualisation Shopify réelle** (desktop + un vrai téléphone) : non faisable d’ici.
5. Supprimer la phrase « Collection en préparation » des descriptions et passer le réglage Pré-lancement sur non au lancement.

## 18. P1 APRÈS PUBLICATION

1. LUNA (coloris inversés), photos réelles manquantes (ISAURE Cognac, AURÉA Beige Sable, VERA Rouge).
2. Contrôle des 4 photos portées déjà en ligne.
3. Choisir un générateur avec référence produit (ou une séance photo) et lancer le batch en commençant par ÉLÉA.
4. Dimensions confirmées → metafields → composant Dimensions.
5. SEO produit, catégories, types ; tarif 0,99 € plafonné sous 90 €.
6. Supprimer les 21 fichiers neutralisés du DRAFT dans l’admin (suppression par API bloquée).

## 19. ÉTAT FINAL

```
THEME :                           LELON — Refonte 2026 — DRAFT
THEME ID :                        205057753422
LIVE MODIFIED :                   NO   (thème publié 205028163918 : dernière modification 22/09/2026 21:56 UTC, inchangée)
PRODUCT MEDIA MODIFIED GLOBALLY : NO   (mêmes médias ; dernière modification produit : 22/09/2026 21:45 UTC)
PRICES MODIFIED :                 NO   (35 / 40 / 60 €, aucun prix barré)
INVENTORY MODIFIED :              NO   (55 variantes à 0, DENY, emplacements inchangés)
CJ MODIFIED :                     NO   (service cjdropshipping et rattachements inchangés)
PUBLISHED :                       NO   (DRAFT en UNPUBLISHED)
READY FOR HUMAN REVIEW :          YES
READY FOR PUBLICATION :           NO   (P0 §17 : stock/CJ, expédition, mentions légales, allégations, VERA,
                                        relecture de la prévisualisation réelle)
PREVIEW URL :                     https://lelon.fr/?preview_theme_id=205057753422
```

Contrôles d’intégrité effectués en fin de session (Admin API) : logo inchangé (aucune modification du mot-marque LELON ni de sa police cette nuit ; aucun fichier logo
touché), prix, stocks, SKU, produits (17) et variantes (55) inchangés, CJ non modifié, paiements non touchés (aucune
requête d’écriture), thème publié non modifié, DRAFT non publié, aucun média produit ajouté ni supprimé.
Synchronisation DRAFT ↔ dépôt : 86 fichiers identiques au MD5 près + `settings_data.json` identique en contenu (Shopify ajoute un
en-tête) ; 21 fichiers neutralisés présents seulement dans le DRAFT (suppression par API refusée, P2-1).

Documents de la nuit : `docs/MORNING-REPORT.md` · `BLOCKED_BY_MERCHANT.md` · `docs/night-shift-backlog.md` ·
`docs/night-shift-log.md` · `docs/inventory-cj-diagnostic.md` · `docs/product-data-audit.md` · `docs/product-image-matrix.md` ·
`docs/image-generation-batch.md` · `docs/generated-image-qa.md` · `docs/photo-coverage-report.md` ·
`docs/parrainage-architecture.md` (révisé) · `tools/image-batch/`.
